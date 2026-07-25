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
    files: ['apps/*/src/{entities,features,widgets}/**/*.{ts,tsx}'],
    rules: {
      // `views`는 FSD 표준 `pages`가 아닌 프로젝트 확장 레이어라 Steiger가 참조를 추적하지 못함
      'fsd/insignificant-slice': 'off',
    },
  },
  {
    files: ['packages/core/src/{entities,shared}/index*.ts'],
    rules: {
      'fsd/no-layer-public-api': 'off',
    },
  },
  {
    files: ['packages/core/src/entities/**/*.{ts,tsx}'],
    rules: {
      // core 엔티티는 앱이 패키지 공개 API로 소비하므로 Steiger 단일 루트 분석에서 참조를 찾을 수 없음
      'fsd/insignificant-slice': 'off',
    },
  },
]);
