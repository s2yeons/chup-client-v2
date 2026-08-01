import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readSource = (path) => readFile(new URL(path, import.meta.url), 'utf8');

const homeView = await readSource('../apps/client/src/views/home/ui/HomeView.tsx');
const applicationsView = await readSource(
  '../apps/client/src/views/applications/ui/ApplicationsView.tsx',
);
const jobCard = await readSource('../apps/client/src/entities/job/ui/JobCard.tsx');
const clientNavigation = await readSource(
  '../apps/client/src/widgets/app-navigation/ui/AppNavigation.tsx',
);
const adminNavigation = await readSource(
  '../apps/admin/src/widgets/app-navigation/ui/AppNavigation.tsx',
);

assert.match(homeView, /grid-cols-2 gap-4 sm:grid-cols-3/);
assert.doesNotMatch(homeView, /note="새로운 결과가 있어요"/);
assert.match(applicationsView, /grid-cols-2 gap-4 sm:grid-cols-3/);

assert.match(jobCard, /<button[\s\S]*type="button"/);
assert.match(jobCard, /job\.positions\.map/);

for (const navigation of [clientNavigation, adminNavigation]) {
  assert.match(navigation, /DialogContent/);
  assert.match(navigation, /<DialogTitle className="sr-only">메뉴<\/DialogTitle>/);
}
