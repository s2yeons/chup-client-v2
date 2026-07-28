# 관리자 대시보드 API 연동 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 관리자 대시보드의 목업 통계와 최근 공고 목록을 실제 관리자 API 데이터로 대체한다.

**Architecture:** admin 앱 전용 `entities/dashboard`가 Swagger의 관리자 대시보드·공고 목록 계약을 소유한다. `DashboardView`는 두 TanStack Query 훅을 소비해 상태별 UI를 렌더링하며, API가 제공하지 않는 지원자 수와 증감 문구는 제거한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, TanStack Query v5, axios, Tailwind CSS 4

## Global Constraints

- API 요청은 `@chup/core/shared`의 `get`만 사용하고, 응답은 `ApiResponseType<T>`에서 `data`만 반환한다.
- admin 앱 전용 타입과 훅은 `apps/admin/src/entities/dashboard`에 둔다.
- API가 정렬을 제공하지 않으므로 공고 목록은 `createdAt` 내림차순으로 표시한다.
- 새 테스트 의존성은 추가하지 않는다. 이 저장소에는 테스트 실행기가 없으며, 이슈의 완료 조건인 lint·FSD·typecheck로 검증한다.

---

## 파일 구조

- 생성: `apps/admin/src/entities/dashboard/api/endpoints.ts` — 관리자 dashboard·jobs URL
- 생성: `apps/admin/src/entities/dashboard/model/types.ts` — Swagger 응답 타입
- 생성: `apps/admin/src/entities/dashboard/model/queryKeys.ts` — 관리자 대시보드 query key
- 생성: `apps/admin/src/entities/dashboard/model/useGetAdminDashboard.ts` — 통계 조회 훅
- 생성: `apps/admin/src/entities/dashboard/model/useGetAdminJobs.ts` — 공고 목록 조회 훅
- 생성: `apps/admin/src/entities/dashboard/index.ts` — 슬라이스 공개 API
- 수정: `apps/admin/src/views/dashboard/ui/DashboardView.tsx` — 목업 제거와 상태별 렌더링
- 수정: `apps/admin/src/entities/application/ui/StatusBadge.tsx` — API 공고 상태 표시

### Task 1: 관리자 대시보드 엔티티 추가

**Consumes:** `get`, `ApiResponseType`, TanStack Query, Swagger `/api/admin/dashboard`, `/api/admin/jobs`

**Produces:** `useGetAdminDashboard`, `useGetAdminJobs`, `AdminDashboardType`, `AdminJobPostingType`

- [ ] endpoint·타입·query key를 기존 client dashboard 패턴과 동일한 세그먼트에 추가한다.
- [ ] 각 훅이 `response.data`를 반환하도록 구현하고 index 배럴에서만 공개한다.
- [ ] `pnpm --filter admin lint && pnpm --filter admin check-types`를 실행한다.

### Task 2: API 데이터로 대시보드 렌더링

**Consumes:** Task 1의 훅, 기존 `StatCard`, `Card`, `StatusBadge`

**Produces:** 목업 Context 없이 동작하고 loading·error·empty 상태를 갖는 대시보드

- [ ] `useRecruitment`와 목업 기반 계산을 제거한다.
- [ ] API 통계 4개를 카드에 연결하고, 조회 중 값은 `-`로 표시한다.
- [ ] 공고를 `createdAt` 내림차순으로 정렬해 목록에 표시하고, 로딩·오류·빈 상태를 렌더링한다.
- [ ] API에 없는 포지션·지원자 수·증감 문구를 렌더링하지 않는다.
- [ ] `RECRUITING`, `CLOSED`를 한국어 상태 배지로 렌더링한다.

### Task 3: 전체 검증과 커밋

- [ ] `pnpm lint`, `pnpm lint:fsd`, `pnpm check-types`, `git diff --check`를 실행한다.
- [ ] dashboard API 변경 파일만 stage해 `update(dashboard): 관리자 API 연동`으로 커밋한다.
