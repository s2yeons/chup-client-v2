# 관리자 공고 첨부파일 관리 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 관리자 공고 수정 폼에서 기존 첨부파일을 유지·삭제하고 새 파일을 추가할 수 있게 한다.

**Architecture:** 공고 상세 응답의 첨부파일 목록은 수정 폼의 `retainedAttachments` 상태로 초기화한다. 저장 시 남은 파일 ID는 query parameter `retainedAttachmentIds`로, 새 파일은 multipart `attachments`로 전송한다. 기존 파일과 신규 파일의 합계는 폼에서 5개로 제한한다.

**Tech Stack:** Next.js 16, React 19, React Hook Form, TanStack Query, Axios, Zod, Node.js built-in test runner

## Global Constraints

- 기존 `@chup/core/shared`의 `patch` 래퍼와 `FormData` 전송 방식을 사용한다.
- `@/entities/dashboard`는 공고 상세 응답 타입과 URL만 소유하고, 파일 선택 상태는 `features/job-registration`에 둔다.
- 새 의존성이나 별도 테스트 프레임워크를 추가하지 않는다.
- 최대 첨부파일 수는 기존·신규 합산 5개다.

---

### Task 1: 유지 첨부파일 ID 직렬화

**Files:**

- Create: `apps/admin/src/features/job-registration/model/getJobRequestUrl.test.ts`
- Modify: `apps/admin/src/features/job-registration/model/getJobRequestUrl.ts`
- Modify: `apps/admin/src/features/job-registration/model/usePatchJob.ts`

**Interfaces:**

- Consumes: `JobRegistrationReqType`, `PATCH /api/admin/jobs/{jobId}`의 `retainedAttachmentIds?: number[]` query parameter
- Produces: `getJobRequestUrl(path, body, retainedAttachmentIds?)`와 `usePatchJob`의 `{ jobId, body, retainedAttachmentIds }` 입력

- [ ] **Step 1: 유지 ID를 query parameter로 직렬화하는 실패 테스트를 작성한다.**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import { getJobRequestUrl } from './getJobRequestUrl';

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
  const url = new URL(getJobRequestUrl('/api/admin/jobs/1', body, [3, 8]), 'https://example.test');

  assert.deepEqual(url.searchParams.getAll('retainedAttachmentIds'), ['3', '8']);
});

test('모든 기존 파일을 삭제할 때 빈 retainedAttachmentIds를 보낸다', () => {
  const url = new URL(getJobRequestUrl('/api/admin/jobs/1', body, []), 'https://example.test');

  assert.deepEqual(url.searchParams.getAll('retainedAttachmentIds'), ['']);
});
```

- [ ] **Step 2: 테스트가 현재 구현에서 실패하는지 확인한다.**

Run: `node --experimental-strip-types --test apps/admin/src/features/job-registration/model/getJobRequestUrl.test.ts`

Expected: `retainedAttachmentIds`가 URL에 없어 assertion이 실패한다.

- [ ] **Step 3: 선택적 유지 ID를 URL helper와 PATCH mutation에 전달한다.**

```ts
export const getJobRequestUrl = (
  path: string,
  body: JobRegistrationReqType,
  retainedAttachmentIds?: number[],
) => {
  const searchParams = new URLSearchParams({/* 기존 공고 필드 */});

  body.positionNames.forEach((positionName) => searchParams.append('positionNames', positionName));
  if (retainedAttachmentIds) {
    if (retainedAttachmentIds.length === 0) {
      searchParams.append('retainedAttachmentIds', '');
    }
    retainedAttachmentIds.forEach((attachmentId) =>
      searchParams.append('retainedAttachmentIds', String(attachmentId)),
    );
  }

  return `${path}?${searchParams}`;
};
```

`PatchJobParamsType`에 `retainedAttachmentIds: number[]`를 추가하고 helper의 세 번째 인자로 전달한다.

- [ ] **Step 4: 테스트와 타입 검사를 통과시킨다.**

Run: `node --experimental-strip-types --test apps/admin/src/features/job-registration/model/getJobRequestUrl.test.ts && pnpm --filter admin check-types`

Expected: 테스트 1개와 타입 검사가 통과한다.

- [ ] **Step 5: 커밋한다.**

```bash
git add apps/admin/src/features/job-registration/model/getJobRequestUrl.ts apps/admin/src/features/job-registration/model/getJobRequestUrl.test.ts apps/admin/src/features/job-registration/model/usePatchJob.ts
git commit -m "fix(job-registration): 유지 첨부파일 ID 전송"
```

### Task 2: 수정 폼의 기존 파일 표시와 삭제 상태

**Files:**

- Modify: `apps/admin/src/entities/dashboard/model/types.ts`
- Modify: `apps/admin/src/features/job-registration/ui/JobRegistrationForm.tsx`

**Interfaces:**

- Consumes: `AdminJobPostingDetailType.attachments`, `usePatchJob({ jobId, body, retainedAttachmentIds })`
- Produces: 삭제된 파일을 제외한 `retainedAttachmentIds`와 총 5개 이하의 신규 `attachments`

- [ ] **Step 1: 상세 응답 첨부파일 타입을 이름 있는 인터페이스로 분리한다.**

```ts
export interface JobAttachmentType {
  id: number;
  fileName: string;
}

export interface AdminJobPostingDetailType extends AdminJobPostingType {
  positions: { id: number; name: string }[];
  attachments: JobAttachmentType[];
}
```

- [ ] **Step 2: 기존 파일 목록을 수정 폼 상태로 초기화한다.**

```tsx
const [retainedAttachments, setRetainedAttachments] = useState<JobAttachmentType[]>([]);

useEffect(() => {
  // 기존 reset 조건을 유지한다.
  setRetainedAttachments(jobDetail?.attachments ?? []);
}, [job, jobDetail, isJobPending, reset]);
```

상세 조회가 끝난 뒤 한 번만 초기화하는 기존 `initializedJobIdRef` 조건 안에서 실행한다.

- [ ] **Step 3: 기존 파일명과 삭제 버튼을 렌더링한다.**

```tsx
{
  job && retainedAttachments.length > 0 && (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">기존 첨부파일</p>
      {retainedAttachments.map((attachment) => (
        <div key={attachment.id} className="flex items-center justify-between">
          <span className="text-sm">{attachment.fileName}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() =>
              setRetainedAttachments((currentAttachments) =>
                currentAttachments.filter(({ id }) => id !== attachment.id),
              )
            }
            aria-label={`${attachment.fileName} 삭제`}
          >
            <X />
          </Button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: 기존·신규 파일 합산 한도를 적용하고 저장 payload를 연결한다.**

```tsx
const attachmentCount = retainedAttachments.length + attachments.length;
const maximumNewAttachmentCount = 5 - retainedAttachments.length;

const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(event.target.files ?? []);

  setValue('attachments', [...attachments, ...files].slice(0, maximumNewAttachmentCount), {
    shouldValidate: true,
  });
  event.target.value = '';
};

patchJob({
  jobId: job.id,
  body,
  retainedAttachmentIds: retainedAttachments.map(({ id }) => id),
});
```

파일 입력은 `attachmentCount === 5`일 때 비활성화하고, 안내 문구는 `기존 파일과 새 파일을 합쳐 최대 5개까지 등록할 수 있습니다.`로 변경한다.

- [ ] **Step 5: 전체 검증과 수동 시나리오를 실행한다.**

Run: `pnpm build && pnpm lint && pnpm check-types && pnpm lint:fsd`

Expected: 모든 명령이 성공한다.

수동 확인: 기존 파일 2개인 공고에서 하나를 삭제하고 새 파일 2개를 추가한 뒤 저장한다. 요청 URL에 남은 파일 ID 하나가 `retainedAttachmentIds`로 있고, multipart `attachments`에는 새 파일 2개가 있어야 한다.

- [ ] **Step 6: 커밋한다.**

```bash
git add apps/admin/src/entities/dashboard/model/types.ts apps/admin/src/features/job-registration/ui/JobRegistrationForm.tsx
git commit -m "update(job-registration): 공고 첨부파일 관리 추가"
```
