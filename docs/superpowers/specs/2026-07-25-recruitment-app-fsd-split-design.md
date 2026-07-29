# Recruitment App FSD Split Design

## Goal

v0의 단일 역할 전환 데모를 학생용 `client` 앱과 관리자용 `admin` 앱으로 분리한다. 두 앱은 같은 목업 채용 데이터와 공통 레이아웃 UI를 사용하되, 라우트·메뉴·업무 기능은 서로 독립적으로 유지한다.

## Scope

- `client`: 홈, 채용 공고, 지원 현황, 내 정보 라우트
- `admin`: 대시보드, 공고 관리, 지원자 관리 라우트
- 공고 생성·상태 변경, 지원, 합격/불합격 처리, 이력서 파일명 변경의 목업 상호작용 유지
- 역할 전환 탭과 단일 컴포넌트 기반 화면 전환 상태 제거
- 제공된 로고 URL을 공통 로고 UI의 입력값으로 사용

실제 API 호출, 인증, 파일 업로드·다운로드, 이메일·Discord 전송은 범위 밖이다. 화면은 목업 상태만 바꾸고 성공/오류 토스트를 표시한다.

## Architecture

### Shared packages

`@chup/ui`에는 도메인 데이터를 모르는 레이아웃 프레임을 둔다.

- `AppShell`: 헤더, 사이드바, 본문 배치를 담당
- `AppHeader`, `AppSidebar`: `children`으로 앱별 콘텐츠를 받음
- `BrandLogo`: 로고 URL과 이름만 받음
- `StatCard`: 라벨, 값, 설명, 아이콘을 받는 범용 지표 카드

`@chup/core/entities`에는 두 앱이 공통으로 사용하는 채용 도메인 목업을 둔다.

- `JobType`, `ApplicationType`과 상태 유니온 타입
- 초기 공고·지원서 데이터
- `RecruitmentProvider`, `useRecruitment`: 공고와 지원서를 업데이트하는 최소 인터페이스

`RecruitmentProvider`는 데모용 임시 상태다. API 계약이 생기면 동일한 엔티티 타입과 화면 인터페이스를 유지한 채 TanStack Query 훅으로 대체한다.

### Apps

두 앱은 서로 import하지 않는다. 각 앱의 `app/layout.tsx`가 `RecruitmentProvider`를 적용하고, 라우트 파일은 해당 `views`의 공개 API만 렌더링한다.

```text
apps/client/src
  app/                     route entry와 Provider
  views/                   home, jobs, applications, profile
  widgets/                 app-navigation, job-detail
  features/                job-apply, resume-replace
  entities/                job UI, application UI

apps/admin/src
  app/                     route entry와 Provider
  views/                   dashboard, postings, applicants
  widgets/                 app-navigation
  features/                job-posting, job-status, applicant-result
  entities/                job UI, application UI
```

`widgets/app-navigation`은 `@chup/ui` 프레임에 각 앱의 메뉴 정의, 현재 경로, 사용자 영역을 주입한다. UI 프레임은 Next.js 라우팅이나 역할을 알지 못한다.

## Data flow

1. 앱 레이아웃이 `RecruitmentProvider`를 마운트한다.
2. views와 features가 `useRecruitment`로 목업 상태와 변경 함수를 읽는다.
3. features가 변경 함수를 호출하고 Sonner 토스트로 결과를 알린다.
4. 다른 라우트도 같은 Provider 상태를 읽으므로 앱 내 라우트 이동 후 변경 결과가 유지된다.

## FSD placement rules

- `JobCard`, `StatusBadge`처럼 공고·지원 상태의 의미를 아는 UI는 앱 `entities`에 둔다.
- 공고 상세 패널은 공고 UI와 지원 행동을 조합하므로 `widgets/job-detail`에 둔다.
- 지원, 공고 등록, 상태 변경, 결과 처리는 각 `features`에 둔다.
- `@chup/ui`에는 순수 시각 컴포넌트만 둔다. 앱별 메뉴 배열, 현재 경로 판단, 권한·사용자 정보는 넣지 않는다.

## Verification

현재 테스트 러너는 없다. 새 테스트 프레임워크는 이번 분리 작업에 추가하지 않는다.

- `pnpm lint`
- `pnpm lint:fsd`
- `pnpm check-types`
- `pnpm build`

각 앱은 별도 포트에서 실행하며, 역할 전환 없이 자기 라우트와 네비게이션만 보여야 한다.
