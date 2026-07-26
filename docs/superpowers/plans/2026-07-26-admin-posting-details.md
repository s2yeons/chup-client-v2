# 어드민 공고 상세 정보 입력 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 어드민이 고용 형태와 회사 소개를 입력하고, 학생이 공고 상세에서 등록 첨부파일명을 확인하게 한다.

**Architecture:** 공고 등록 상태는 단일 소비처인 `PostingsView`에 유지하고 기존 `JobType.employment`, `JobType.description`, `JobType.attachments`에 저장한다. 학생 상세 화면은 새 모델을 만들지 않고 이 세 필드를 그대로 표시한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `@base-ui/react`, `@chup/ui`

## Global Constraints

- 고용 형태는 `정규직`, `산업기능요원`, `인턴`, `계약직` 중 하나를 선택한다.
- 회사명·고용 형태·회사 소개·포지션 1개 이상·마감일은 필수이며 오류는 `@chup/ui` `toast`로 알린다.
- 첨부파일은 기존 `JobType.attachments` 파일명 배열만 사용하며 실제 업로드·다운로드 API는 추가하지 않는다.
- 첨부파일이 없으면 학생 공고 상세의 첨부파일 영역을 렌더링하지 않는다.
- 회사 로고 업로드와 별도 공고 제목 입력은 추가하지 않는다.
- 자동화 테스트 파일은 추가하지 않고, 수동 UI 검증과 `pnpm build`, `pnpm lint`, `pnpm lint:fsd`, `pnpm check-types`만 수행한다.

---

## 파일 구조

- 수정: `apps/admin/src/views/postings/ui/PostingsView.tsx` — 고용 형태·회사 소개 입력 상태, 검증, 새 공고 저장을 담당한다.
- 수정: `apps/client/src/widgets/job-detail/ui/JobDetail.tsx` — 공고의 실제 첨부파일 파일명을 표시한다.

## Task 1: 공고 등록 폼에 고용 형태와 회사 소개 입력 추가

**Files:**
- Modify: `apps/admin/src/views/postings/ui/PostingsView.tsx`

**Consumes:** `JobType.employment`, `JobType.description`, 기존 `Button`, `Input`, `Select`, `toast`

**Produces:** 선택된 고용 형태와 회사 소개가 저장된 새 `JobType`

- [ ] **Step 1: 고용 형태·회사 소개 상태와 선택값을 선언한다.**

```tsx
const EMPLOYMENT_OPTIONS = ['정규직', '산업기능요원', '인턴', '계약직'];

const [employment, setEmployment] = useState<string>('');
const [description, setDescription] = useState<string>('');
```

- [ ] **Step 2: 포지션 입력 앞에 고용 형태 선택 UI와 회사 소개 입력을 렌더링한다.**

`Select`의 값은 `employment`에 연결하고, 각 `EMPLOYMENT_OPTIONS` 값을 `SelectItem`으로 렌더링한다. 회사 소개는 단일 소비처이므로 새 UI primitive를 만들지 않고, 기존 `Input`과 같은 border·radius·focus 스타일을 적용한 `<textarea>`를 사용한다.

```tsx
<textarea
  value={description}
  onChange={(event) => setDescription(event.target.value)}
  placeholder="회사 소개"
  className="border-input focus-visible:border-ring focus-visible:ring-ring/50 min-h-28 rounded-lg border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 sm:col-span-2"
/>
```

- [ ] **Step 3: 등록 검증과 새 공고 값을 교체한다.**

```tsx
if (!company.trim() || !employment || !description.trim() || positions.length === 0 || !deadline) {
  toast.error('회사명, 고용 형태, 회사 소개, 모집 포지션, 마감일을 입력해주세요.');
  return;
}

description: description.trim(),
employment,
```

등록 뒤 `employment`와 `description`도 초기화한다.

- [ ] **Step 4: 수동 동작을 확인한다.**

1. 고용 형태 또는 회사 소개를 비우고 등록해 오류 토스트가 보이는지 확인한다.
2. 모든 필수 입력을 완료해 새 행에 선택한 고용 형태가 보이는지 확인한다.

- [ ] **Step 5: 정적 검증과 커밋을 수행한다.**

Run: `pnpm --filter admin lint && pnpm --filter admin check-types && git diff --check`

```bash
git add apps/admin/src/views/postings/ui/PostingsView.tsx
git commit -m "update(posting): 상세 정보 입력 추가"
```

## Task 2: 학생 공고 상세에 실제 첨부파일명 표시

**Files:**
- Modify: `apps/client/src/widgets/job-detail/ui/JobDetail.tsx`

**Consumes:** `JobType.attachments: string[]`, 기존 `FileText`, `Download`, `toast`

**Produces:** 첨부파일이 있는 공고에서만 보이는 파일명 목록

- [ ] **Step 1: 하드코딩된 첨부파일 버튼을 조건부 파일명 목록으로 교체한다.**

```tsx
{job.attachments.length > 0 && (
  <section className="mt-8">
    <h3 className="font-bold">첨부파일</h3>
    <div className="mt-3 space-y-2">
      {job.attachments.map((attachment) => (
        <Button
          key={attachment}
          variant="outline"
          className="h-auto w-full justify-between p-4 text-left"
          onClick={() => toast.success(`${attachment} 다운로드를 시작합니다.`)}
        >
          <span className="flex items-center gap-3">
            <FileText className="text-primary size-5" />
            <strong className="text-sm">{attachment}</strong>
          </span>
          <Download className="size-4" />
        </Button>
      ))}
    </div>
  </section>
)}
```

- [ ] **Step 2: 수동 동작을 확인한다.**

1. 첨부파일이 있는 새 공고 상세에서 등록한 파일명이 모두 보이는지 확인한다.
2. 첨부파일이 없는 기존 공고 상세에 `첨부파일` 섹션이 없는지 확인한다.
3. 파일 버튼을 누르면 해당 파일명으로 다운로드 토스트가 보이는지 확인한다.

- [ ] **Step 3: 전체 정적 검증과 커밋을 수행한다.**

Run: `pnpm build && pnpm lint && pnpm lint:fsd && pnpm check-types`

```bash
git add apps/client/src/widgets/job-detail/ui/JobDetail.tsx
git commit -m "update(job): 첨부파일 상세 표시"
```
