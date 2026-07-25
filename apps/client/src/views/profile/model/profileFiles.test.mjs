import assert from 'node:assert/strict';
import test from 'node:test';

import {
  addProfileFile,
  initialProfileFiles,
  isProfileFileLimitReached,
  MAX_PROFILE_FILE_COUNT,
  removeProfileFile,
} from './profileFiles.ts';

test('프로필 파일은 최대 3개까지만 추가한다', () => {
  const twoFiles = addProfileFile(initialProfileFiles, { id: 'portfolio', name: '포트폴리오.pdf' });
  const threeFiles = addProfileFile(twoFiles, { id: 'other', name: '기타.pdf' });
  const cappedFiles = addProfileFile(threeFiles, { id: 'extra', name: '추가.pdf' });

  assert.equal(MAX_PROFILE_FILE_COUNT, 3);
  assert.equal(cappedFiles.length, 3);
  assert.deepEqual(
    removeProfileFile(cappedFiles, 'portfolio').map((file) => file.name),
    ['김도윤_2314_이력서.pdf', '기타.pdf'],
  );
});

test('파일이 3개면 추가 제한 상태다', () => {
  assert.equal(
    isProfileFileLimitReached([
      { id: 'resume', name: '이력서.pdf' },
      { id: 'portfolio', name: '포트폴리오.pdf' },
      { id: 'other', name: '기타.pdf' },
    ]),
    true,
  );
});
