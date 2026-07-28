# 관리자 대시보드 API 연동 설계

## 목표

관리자 대시보드가 목업 Context 대신 관리자 통계와 공고 목록 API를 조회해 현재 상태를 표시한다.

## 범위

- `GET /api/admin/dashboard`로 모집중 공고, 전체 지원자, 결과 대기, 서류 합격 통계를 조회한다.
- `GET /api/admin/jobs`로 전체 공고를 조회해 `createdAt` 내림차순의 최근 공고 목록을 표시한다.
- 통계와 공고 목록의 loading·error 상태를 표시하고, 공고가 없을 때 empty 상태를 표시한다.
- 대시보드에서만 사용하는 API 타입·endpoint·query key·조회 훅은 admin 앱의 `entities/dashboard`에 둔다.

## 제외 범위

- 공고 등록·수정·상태 변경과 지원자 결과 처리는 포함하지 않는다.
- 관리자 공고 전체 화면용 공용 job 엔티티는 만들지 않는다.
- API에 없는 공고별 지원자 수와 목업 증감 문구는 표시하지 않는다.

## 구성과 데이터 흐름

1. `useGetAdminDashboard`는 `/api/admin/dashboard`의 `AdminDashboardType`을 반환한다.
2. `useGetAdminJobs`는 `/api/admin/jobs`의 공고 배열을 반환하고, `DashboardView`가 `createdAt` 내림차순으로 정렬한다. Swagger에 최근순 정렬 파라미터가 없기 때문이다.
3. `DashboardView`는 `RecruitmentProvider`를 더 이상 소비하지 않는다.
4. API 공고 상태 `RECRUITING`, `CLOSED`는 기존 `StatusBadge`에서 각각 `모집중`, `마감`으로 표시한다. 기존 목업 상태도 계속 지원한다.

## 오류와 빈 상태

- 통계 조회 중에는 카드 값에 `-`를 표시하고, 실패 시 통계 영역에 재시도 안내를 표시한다.
- 공고 목록 조회 중에는 로딩 안내를, 실패 시 오류 안내를, 빈 배열이면 empty 안내를 표시한다.
- 인증 실패는 공용 axios 인터셉터가 `/signin`으로 이동시키므로 대시보드에서 별도 처리하지 않는다.

## 검증

- 목업 `useRecruitment` import가 대시보드에 남지 않는지 확인한다.
- API 타입·endpoint·query key·hook의 FSD 배럴 노출을 확인한다.
- `pnpm lint`, `pnpm lint:fsd`, `pnpm check-types`를 실행한다.
