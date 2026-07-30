import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-expect-error Node 24의 TypeScript 실행은 확장자 명시 import가 필요하다.
import { getJobRequestUrl } from './getJobRequestUrl.ts';

const body = {
  companyName: 'CHUP',
  description: '채용 공고',
  employmentType: 'INTERN' as const,
  recruitStart: '2026-07-30',
  recruitEnd: '2026-08-30',
  positionNames: ['백엔드'],
  attachments: [],
};

test('retainedAttachmentIds를 반복 query parameter로 보낸다', () => {
  const url = new URL(
    getJobRequestUrl('/api/admin/jobs/1', body, [3, 8]),
    'https://example.test',
  );

  assert.deepEqual(url.searchParams.getAll('retainedAttachmentIds'), ['3', '8']);
});

test('모든 기존 파일을 삭제할 때 빈 retainedAttachmentIds를 보낸다', () => {
  const url = new URL(
    getJobRequestUrl('/api/admin/jobs/1', body, []),
    'https://example.test',
  );

  assert.deepEqual(url.searchParams.getAll('retainedAttachmentIds'), ['']);
});
