# 프로필 첨부 파일 UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 학생 프로필에서 PDF 첨부 파일을 로컬 상태로 최대 3개까지 추가·삭제한다.

**Architecture:** `views/profile/model`이 초기 파일 목록과 최대 개수 제한을 관리하는 순수 함수를 제공한다. `ProfileView`는 해당 모델을 상태에 적용하고, 범용 파일 추가 feature는 PDF 파일명만 전달한다. 실제 업로드와 새로고침 후 상태 유지는 포함하지 않는다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `@chup/ui`, Node.js 내장 테스트 러너

## Global Constraints

- PDF 파일만 허용한다.
- 계정당 첨부 파일은 정확히 3개로 제한한다.
- 파일 종류를 구분하지 않고 파일명만 표시한다.
- API, 영구 저장, 새 의존성, 드래그 앤 드롭은 추가하지 않는다.
- 기존 `ProfileView`의 사용자 변경 사항은 덮어쓰지 않는다.

---

### Task 1: 프로필 파일 상태 모델

**Files:**

- Create: `apps/client/src/views/profile/model/profileFiles.ts`
- Create: `apps/client/src/views/profile/model/profileFiles.test.mjs`

**Interfaces:**

- Produces: `ProfileFileType`, `MAX_PROFILE_FILE_COUNT`, `initialProfileFiles`, `addProfileFile`, `removeProfileFile`
- Consumes: 없음

- [ ] **Step 1: Write the failing test**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MAX_PROFILE_FILE_COUNT,
  addProfileFile,
  initialProfileFiles,
  removeProfileFile,
} from './profileFiles.ts';

test('프로필 파일은 최대 3개까지만 추가한다', () => {
  const twoFiles = addProfileFile(initialProfileFiles, { id: 'portfolio', name: '포트폴리오.pdf' });
  const threeFiles = addProfileFile(twoFiles, { id: 'other', name: '기타.pdf' });
  const cappedFiles = addProfileFile(threeFiles, { id: 'extra', name: '추가.pdf' });

  assert.equal(MAX_PROFILE_FILE_COUNT, 3);
  assert.equal(cappedFiles.length, 3);
  assert.deepEqual(removeProfileFile(cappedFiles, 'portfolio').map((file) => file.name), [
    '김도윤_2314_이력서.pdf',
    '기타.pdf',
  ]);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test apps/client/src/views/profile/model/profileFiles.test.mjs`

Expected: FAIL because `profileFiles.ts` does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
export interface ProfileFileType {
  id: string;
  name: string;
}

export const MAX_PROFILE_FILE_COUNT = 3;

export const initialProfileFiles: ProfileFileType[] = [
  { id: 'resume', name: '김도윤_2314_이력서.pdf' },
];

export const addProfileFile = (files: ProfileFileType[], file: ProfileFileType) =>
  files.length >= MAX_PROFILE_FILE_COUNT ? files : [...files, file];

export const removeProfileFile = (files: ProfileFileType[], fileId: string) =>
  files.filter((file) => file.id !== fileId);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test apps/client/src/views/profile/model/profileFiles.test.mjs`

Expected: PASS with one test.

- [ ] **Step 5: Commit**

```bash
git add apps/client/src/views/profile/model/profileFiles.ts apps/client/src/views/profile/model/profileFiles.test.ts
git commit -m "add(profile): 첨부 파일 상태 모델 추가"
```

### Task 2: 파일 추가 feature와 프로필 목록 UI

**Files:**

- Create: `apps/client/src/features/profile-file-upload/index.ts`
- Create: `apps/client/src/features/profile-file-upload/ui/ProfileFileUploadInput.tsx`
- Delete: `apps/client/src/features/resume-replace/index.ts`
- Delete: `apps/client/src/features/resume-replace/ui/ResumeReplaceInput.tsx`
- Modify: `apps/client/src/views/profile/ui/ProfileView.tsx`

**Interfaces:**

- Consumes: `ProfileFileType`, `MAX_PROFILE_FILE_COUNT`, `addProfileFile`, `initialProfileFiles`, `isProfileFileLimitReached`, `removeProfileFile` from `@/views/profile/model/profileFiles`
- Produces: `ProfileFileUploadInput` with `disabled: boolean` and `onAdd: (fileName: string) => void`

- [ ] **Step 1: Write the failing behavior assertion**

```ts
import { isProfileFileLimitReached } from './profileFiles.ts';

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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test apps/client/src/views/profile/model/profileFiles.test.mjs`

Expected: FAIL because `isProfileFileLimitReached` is not exported yet.

- [ ] **Step 3: Replace the single-resume input with a generic PDF input**

```tsx
interface ProfileFileUploadInputProps {
  disabled: boolean;
  onAdd: (fileName: string) => void;
}

const ProfileFileUploadInput = ({ disabled, onAdd }: ProfileFileUploadInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileName = event.target.files?.[0]?.name;

    if (fileName) onAdd(fileName);
    event.target.value = '';
  };

  return (
    <label className="bg-background inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm font-medium">
      <input disabled={disabled} type="file" accept="application/pdf" className="sr-only" onChange={handleChange} />
      파일 추가
    </label>
  );
};
```

Add `export const isProfileFileLimitReached = (files: ProfileFileType[]) => files.length >= MAX_PROFILE_FILE_COUNT;` to `profileFiles.ts`. In `ProfileView`, initialize `useState<ProfileFileType[]>(initialProfileFiles)`, pass `isProfileFileLimitReached(files)` to the input, and call `addProfileFile` with `crypto.randomUUID()` for each selected filename. Render each file with `FileText`, its name, and an accessible destructive icon button that calls `removeProfileFile`. Change the card copy to `첨부 파일`, `PDF 파일을 최대 3개까지 등록할 수 있습니다.`, and show `최대 3개까지 등록할 수 있습니다.` only when the limit is reached.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test apps/client/src/views/profile/model/profileFiles.test.ts`

Expected: PASS with the 3-file limit and deletion behavior covered.

- [ ] **Step 5: Run project verification**

Run: `pnpm build && pnpm lint && pnpm lint:fsd && pnpm check-types`

Expected: all tasks succeed with no warnings.

- [ ] **Step 6: Commit**

```bash
git add apps/client/src/features/profile-file-upload apps/client/src/features/resume-replace apps/client/src/views/profile/ui/ProfileView.tsx
git commit -m "add(profile): 첨부 파일 관리 UI 추가"
```
