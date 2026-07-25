import { readdir, readFile } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';

const LAYER_ORDER = ['shared', 'entities', 'features', 'widgets', 'views', 'app'];
const LAYER_RANK = new Map(LAYER_ORDER.map((layer, index) => [layer, index]));
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx']);
const IMPORT_PATTERN =
  /(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;

const getSourceFiles = async (path) => {
  const entries = await readdir(path, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve(path, entry.name);

      if (entry.isDirectory()) return getSourceFiles(entryPath);
      return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [entryPath] : [];
    }),
  );

  return files.flat();
};

const getLayerAndSlice = (sourceRoot, path) => {
  const [layer, slice] = relative(sourceRoot, path).split(sep);

  return { layer, slice };
};

const getImportPath = (sourceRoot, filePath, specifier) => {
  if (specifier.startsWith('@/')) return resolve(sourceRoot, specifier.slice(2));
  if (specifier.startsWith('.')) return resolve(dirname(filePath), specifier);

  return undefined;
};

const checkSourceRoot = async (sourceRoot) => {
  const errors = [];
  const sourceFiles = await getSourceFiles(sourceRoot);

  for (const filePath of sourceFiles) {
    const source = getLayerAndSlice(sourceRoot, filePath);
    const sourceRank = LAYER_RANK.get(source.layer);

    if (sourceRank === undefined) continue;

    const content = await readFile(filePath, 'utf8');

    for (const match of content.matchAll(IMPORT_PATTERN)) {
      const importPath = getImportPath(sourceRoot, filePath, match[1] ?? match[2]);
      if (!importPath) continue;

      const target = getLayerAndSlice(sourceRoot, importPath);
      const targetRank = LAYER_RANK.get(target.layer);

      if (targetRank === undefined) continue;

      if (targetRank > sourceRank) {
        errors.push(
          `${relative(sourceRoot, filePath)}: ${source.layer} cannot import ${target.layer}`,
        );
      }

      if (
        source.layer === target.layer &&
        source.slice !== target.slice &&
        source.layer !== 'app' &&
        source.layer !== 'shared'
      ) {
        errors.push(
          `${relative(sourceRoot, filePath)}: ${source.layer} slices cannot import each other`,
        );
      }
    }
  }

  return errors;
};

const sourceRoots = process.argv.slice(2).map((path) => resolve(path));
const errors = (await Promise.all(sourceRoots.map(checkSourceRoot))).flat();

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
