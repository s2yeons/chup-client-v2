import { defineConfig } from 'steiger';

import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: ['apps/*/src/app/providers.tsx'],
    rules: {
      'fsd/segments-by-purpose': 'off',
    },
  },
  {
    files: ['packages/core/src/shared/index*.ts'],
    rules: {
      'fsd/no-layer-public-api': 'off',
    },
  },
]);
