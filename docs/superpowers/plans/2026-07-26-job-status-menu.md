# 공고 상태 변경 메뉴 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 공고 관리의 더보기 버튼에서 명시적인 상태 변경 메뉴를 제공한다.

**Architecture:** 기존 `JobStatusButton` 안에서 `DropdownMenu`를 조합한다. 메뉴를 여는 행동은 상태를 바꾸지 않고, 메뉴 항목만 기존 `setJobs` 상태 변경과 토스트를 실행한다.

**Tech Stack:** React 19, TypeScript, `@chup/ui`, `@base-ui/react`

## Global Constraints

- 모집중 공고는 `공고 마감`, 마감 공고는 `모집 재개` 메뉴 항목 하나만 표시한다.
- 메뉴를 여는 것만으로 공고 상태를 바꾸지 않는다.
- API, 확인 모달, 공고 삭제, 자동화 테스트 파일은 추가하지 않는다.
- 완료 전 `pnpm build`, `pnpm lint`, `pnpm lint:fsd`, `pnpm check-types`를 실행한다.

---

## 파일 구조

- 수정: `apps/admin/src/features/job-status/ui/JobStatusButton.tsx` — 메뉴 트리거와 상태 변경 메뉴 항목을 담당한다.

## Task 1: 명시적 공고 상태 변경 메뉴 추가

**Files:**

- Modify: `apps/admin/src/features/job-status/ui/JobStatusButton.tsx`

**Consumes:** `JobType.status`, `useRecruitment().setJobs`, `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `toast`

**Produces:** 메뉴 항목을 선택할 때만 변경되는 공고 상태

- [ ] **Step 1: 상태 변경 handler가 목표 상태를 받도록 바꾼다.**

```tsx
const handleStatusChange = (status: JobType['status']) => {
  setJobs((jobs) =>
    jobs.map((currentJob) => (currentJob.id === job.id ? { ...currentJob, status } : currentJob)),
  );
  toast.success(status === '마감' ? '공고를 마감했습니다.' : '모집을 재개했습니다.');
};
```

- [ ] **Step 2: 더보기 버튼을 메뉴 트리거로 감싸고 반대 상태 메뉴를 렌더링한다.**

```tsx
<DropdownMenu>
  <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label="공고 상태 메뉴" />}>
    <MoreHorizontal />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem
      onClick={() => handleStatusChange(job.status === '모집중' ? '마감' : '모집중')}
    >
      {job.status === '모집중' ? '공고 마감' : '모집 재개'}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

- [ ] **Step 3: 수동 동작을 확인한다.**

1. `...` 버튼만 눌러도 목록 상태가 바뀌지 않는지 확인한다.
2. 모집중 공고에서 `공고 마감`을 눌러 상태와 토스트가 바뀌는지 확인한다.
3. 마감 공고에서 `모집 재개`를 눌러 상태와 토스트가 바뀌는지 확인한다.

- [ ] **Step 4: 정적 검증과 커밋을 수행한다.**

Run: `pnpm build && pnpm lint && pnpm lint:fsd && pnpm check-types`

```bash
git add apps/admin/src/features/job-status/ui/JobStatusButton.tsx
git commit -m "update(job): 상태 변경 메뉴 추가"
```
