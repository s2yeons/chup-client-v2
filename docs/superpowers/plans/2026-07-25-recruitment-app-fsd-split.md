# Recruitment App FSD Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** v0 역할 전환 데모를 독립적인 학생·관리자 Next.js 앱으로 분리하고 FSD 경계를 유지한다.

**Architecture:** 공통 채용 타입·목업 상태는 @chup/core/entities가 제공하고, 공통 레이아웃 프레임은 @chup/ui가 제공한다. 각 앱은 라우트 파일에서 views만 렌더링하며, 앱별 메뉴와 업무 동작은 widgets·features에 둔다.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Base UI, TanStack Query, Sonner

## Global Constraints

- client와 admin은 서로 import하지 않는다.
- 공통 순수 UI는 @chup/ui, 공유 도메인 모델은 @chup/core/entities에 둔다.
- 앱 내부 의존성은 app → views → widgets → features → entities → shared 방향만 허용한다.
- @chup/ui 컴포넌트 파일명은 kebab-case와 named export를 유지한다.
- 외부 API·인증·실제 파일 전송은 구현하지 않고, 제공된 목업 상태와 Sonner 토스트만 유지한다.
- 테스트 러너는 없고 사용자 승인 명세에서 추가를 제외했다. 이 v0 생성 프로토타입 분리 작업은 TDD 예외로 타입·lint·FSD·빌드 검증을 사용한다.

---

### Task 1: 공유 채용 엔티티와 목업 Provider 추가

**Files:**
- Create: packages/core/src/entities/index.ts
- Create: packages/core/src/entities/recruitment/model/types.ts
- Create: packages/core/src/entities/recruitment/model/mock-data.ts
- Create: packages/core/src/entities/recruitment/model/provider.tsx
- Create: packages/core/src/entities/recruitment/index.ts
- Modify: packages/core/package.json

**Interfaces:**
- Produces: JobType, ApplicationType, RecruitmentProvider, useRecruitment
- Consumes: React createContext, useContext, useState

- [ ] **Step 1: 공통 타입을 정의한다**

~~~typescript
export type JobStatusType = '모집중' | '마감';
export type ApplicationStatusType = '지원 완료' | '서류 합격' | '서류 불합격';

export interface JobType {
  id: number;
  company: string;
  description: string;
  positions: string[];
  employment: string;
  deadline: string;
  dday: number;
  featured?: boolean;
  applicants: number;
  status: JobStatusType;
}

export interface ApplicationType {
  id: number;
  name: string;
  studentId: string;
  company: string;
  position: string;
  date: string;
  email: string;
  phone: string;
  status: ApplicationStatusType;
}
~~~

ApplicationType에는 id, name, studentId, company, position, date, email, phone, status를 포함한다.

- [ ] **Step 2: 제공된 initialJobs와 initialApplications 리터럴을 mock-data.ts로 이동한다**

두 배열은 읽기 전용 초기값으로 export한다. 카카오·토스·당근·네이버클라우드 공고와 제공된 지원서 네 건의 데이터를 그대로 유지한다.

- [ ] **Step 3: 앱별로 독립적인 목업 상태 Provider를 구현한다**

~~~tsx
'use client';

interface RecruitmentContextType {
  jobs: JobType[];
  applications: ApplicationType[];
  setJobs: React.Dispatch<React.SetStateAction<JobType[]>>;
  setApplications: React.Dispatch<React.SetStateAction<ApplicationType[]>>;
}

export const RecruitmentProvider = ({ children }: React.PropsWithChildren) => {
  const [jobs, setJobs] = useState<JobType[]>(initialJobs);
  const [applications, setApplications] = useState<ApplicationType[]>(initialApplications);

  return (
    <RecruitmentContext.Provider value={{ jobs, applications, setJobs, setApplications }}>
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (!context) throw new Error('RecruitmentProvider 내부에서 사용해야 합니다.');
  return context;
};
~~~

- [ ] **Step 4: core 공개 API를 추가한다**

packages/core/package.json exports에 ./entities → ./src/entities/index.ts를 추가하고, entities/index.ts와 recruitment/index.ts로만 타입·Provider를 노출한다.

- [ ] **Step 5: 패키지를 검증한다**

Run: pnpm --filter @chup/core check-types && pnpm --filter @chup/core lint

Expected: 두 명령이 모두 exit code 0으로 끝난다.

- [ ] **Step 6: 커밋한다**

~~~bash
git add packages/core/package.json packages/core/src/entities
git commit -m "add(recruitment): 공통 목업 엔티티 추가"
~~~

### Task 2: 디자인 시스템에 공통 레이아웃 프레임 추가

**Files:**
- Create: packages/ui/src/ui/app-shell.tsx
- Create: packages/ui/src/ui/brand-logo.tsx
- Create: packages/ui/src/ui/stat-card.tsx
- Modify: packages/ui/src/index.ts

**Interfaces:**
- Produces: AppShell, AppHeader, AppSidebar, AppMain, BrandLogo, StatCard
- Consumes: React children, LucideIcon, existing Card and cn

- [ ] **Step 1: 라우트·역할을 모르는 shell 컴포넌트를 만든다**

~~~tsx
interface AppShellProps { children: React.ReactNode; }
interface AppHeaderProps { children: React.ReactNode; }
interface AppSidebarProps { children: React.ReactNode; mobile?: boolean; }
interface AppMainProps { children: React.ReactNode; }

export const AppShell = ({ children }: AppShellProps) => (
  <div className="min-h-screen bg-background text-foreground">{children}</div>
);
~~~

AppHeader는 sticky 64px header, AppSidebar는 데스크톱 240px 또는 모바일 전체 너비, AppMain은 반응형 본문 여백만 책임진다. 메뉴·링크·사용자 정보는 children으로 주입한다.

- [ ] **Step 2: 로고와 지표 카드 UI를 만든다**

~~~tsx
interface BrandLogoProps {
  imageSrc: string;
  name: string;
  compact?: boolean;
}

interface StatCardProps {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
}
~~~

BrandLogo는 generic img 요소로 로고 URL을 출력한다. StatCard는 기존 Card primitive를 조합하며 비즈니스 계산은 하지 않는다.

- [ ] **Step 3: UI 공개 API에 export를 추가한다**

~~~typescript
export * from './ui/app-shell';
export * from './ui/brand-logo';
export * from './ui/stat-card';
~~~

- [ ] **Step 4: UI를 빌드·검증한다**

Run: pnpm --filter @chup/ui build && pnpm --filter @chup/ui lint && pnpm --filter @chup/ui check-types

Expected: dist에 JS·d.ts·CSS가 생성되고 검사에 실패하지 않는다.

- [ ] **Step 5: 커밋한다**

~~~bash
git add packages/ui/src packages/ui/dist
git commit -m "add(ui): 공통 앱 레이아웃 프레임 추가"
~~~

### Task 3: client 앱 레이아웃·라우트·학생 네비게이션 구성

**Files:**
- Modify: apps/client/src/app/providers.tsx
- Modify: apps/client/src/app/layout.tsx
- Modify: apps/client/src/app/page.tsx
- Create: apps/client/src/app/jobs/page.tsx
- Create: apps/client/src/app/applications/page.tsx
- Create: apps/client/src/app/profile/page.tsx
- Create: apps/client/src/widgets/app-navigation/model/navigation.ts
- Create: apps/client/src/widgets/app-navigation/ui/AppNavigation.tsx
- Create: apps/client/src/widgets/app-navigation/index.ts

**Interfaces:**
- Consumes: RecruitmentProvider, AppShell, AppHeader, AppSidebar, AppMain, BrandLogo
- Produces: 학생 메뉴와 네 개의 route entry

- [ ] **Step 1: QueryClientProvider 내부에 RecruitmentProvider를 적용한다**

~~~tsx
<QueryClientProvider client={queryClient}>
  <RecruitmentProvider>{children}</RecruitmentProvider>
  <ReactQueryDevtools initialIsOpen={false} />
  <Toaster position="top-center" richColors />
</QueryClientProvider>
~~~

- [ ] **Step 2: 학생 메뉴를 링크 데이터로 정의한다**

~~~typescript
export const clientNavigationItems = [
  { href: '/', label: '홈', icon: LayoutDashboard },
  { href: '/jobs', label: '채용 공고', icon: BriefcaseBusiness },
  { href: '/applications', label: '지원 현황', icon: FileText },
  { href: '/profile', label: '내 정보', icon: CircleUserRound },
] as const;
~~~

- [ ] **Step 3: AppNavigation을 만든다**

usePathname과 next/link로 active 상태를 계산한다. 이 widget만 모바일 메뉴 열림 상태와 학생 계정 카드, 알림·로그아웃 placeholder toast를 가진다. client 앱 이외의 코드나 역할 전환 state는 넣지 않는다.

- [ ] **Step 4: RootLayout에서 navigation widget으로 route children을 감싼다**

~~~tsx
<Providers>
  <AppNavigation>{children}</AppNavigation>
</Providers>
~~~

AppNavigation은 AppShell과 AppMain 안에 children을 렌더링한다. 이로써 모든 학생 route가 같은 header/sidebar frame과 Provider 상태를 공유한다.

- [ ] **Step 5: 라우트 파일을 view의 얇은 진입점으로 만든다**

~~~tsx
import { JobsView } from '@/views/jobs';

const JobsPage = () => <JobsView />;

export default JobsPage;
~~~

루트는 HomeView, 나머지는 ApplicationsView와 ProfileView를 각각 하나씩만 import한다.

- [ ] **Step 6: client 라우트를 검증한다**

Run: pnpm --filter client check-types && pnpm --filter client lint

Expected: 네 route type이 생성되고 cross-layer import가 없다.

- [ ] **Step 7: 커밋한다**

~~~bash
git add apps/client/src/app apps/client/src/widgets/app-navigation
git commit -m "add(client): 학생 앱 레이아웃과 라우트 추가"
~~~

### Task 4: client 도메인 UI·기능·views 분리

**Files:**
- Create: apps/client/src/entities/job/ui/JobCard.tsx
- Create: apps/client/src/entities/application/ui/StatusBadge.tsx
- Create: apps/client/src/entities/job/index.ts
- Create: apps/client/src/entities/application/index.ts
- Create: apps/client/src/features/job-apply/ui/ApplyButton.tsx
- Create: apps/client/src/features/job-apply/index.ts
- Create: apps/client/src/features/resume-replace/ui/ResumeReplaceInput.tsx
- Create: apps/client/src/features/resume-replace/index.ts
- Create: apps/client/src/widgets/job-detail/ui/JobDetail.tsx
- Create: apps/client/src/widgets/job-detail/index.ts
- Create: apps/client/src/views/home/ui/HomeView.tsx
- Create: apps/client/src/views/jobs/ui/JobsView.tsx
- Create: apps/client/src/views/applications/ui/ApplicationsView.tsx
- Create: apps/client/src/views/profile/ui/ProfileView.tsx
- Create: index.ts files for each view

**Interfaces:**
- Consumes: shared types/state and UI primitives
- Produces: four student views and preserved v0 interactions

- [ ] **Step 1: entity UI를 구현한다**

~~~tsx
interface JobCardProps {
  job: JobType;
  onOpen: (job: JobType) => void;
}

interface StatusBadgeProps {
  status: JobStatusType | ApplicationStatusType;
}
~~~

JobCard에는 D-day·회사·포지션·고용 형태를, StatusBadge에는 상태별 색상만 둔다. mutation과 route navigation을 넣지 않는다.

- [ ] **Step 2: 지원·이력서 feature를 구현한다**

ApplyButton은 김도윤의 동일 회사·포지션 중복 지원을 오류 toast로 막고, 새 지원서를 앞에 추가한 뒤 onComplete를 호출한다. ResumeReplaceInput은 선택한 PDF 파일 이름만 local state로 바꾸고 성공 toast를 보인다.

- [ ] **Step 3: JobDetail widget을 구현한다**

상세 패널 open/close와 선택 포지션은 widget이 책임진다. 지원 mutation은 ApplyButton으로 위임한다.

- [ ] **Step 4: 네 student view를 조합한다**

HomeView는 hero·3개 지표·모집중 추천 공고 3개를 표시한다. JobsView는 검색·고용 형태 filter를 local state로 가진다. ApplicationsView는 김도윤 지원서만 보인다. ProfileView는 정적 프로필과 ResumeReplaceInput을 조합한다.

- [ ] **Step 5: client를 빌드하고 FSD를 검증한다**

Run: pnpm --filter client build && pnpm lint:fsd

Expected: /, /jobs, /applications, /profile이 빌드되고 중복 지원이 거절되며 FSD 오류가 없다.

- [ ] **Step 6: 커밋한다**

~~~bash
git add apps/client/src/entities apps/client/src/features apps/client/src/widgets/job-detail apps/client/src/views
git commit -m "add(client): 학생 채용 화면 분리"
~~~

### Task 5: admin 앱 레이아웃·라우트·관리자 네비게이션 구성

**Files:**
- Modify: apps/admin/src/app/providers.tsx
- Modify: apps/admin/src/app/layout.tsx
- Modify: apps/admin/src/app/page.tsx
- Create: apps/admin/src/app/postings/page.tsx
- Create: apps/admin/src/app/applicants/page.tsx
- Create: apps/admin/src/widgets/app-navigation/model/navigation.ts
- Create: apps/admin/src/widgets/app-navigation/ui/AppNavigation.tsx
- Create: apps/admin/src/widgets/app-navigation/index.ts

**Interfaces:**
- Consumes: RecruitmentProvider and shared shell
- Produces: 관리자 메뉴와 세 route entry

- [ ] **Step 1: admin Provider tree에 RecruitmentProvider와 Toaster를 적용한다**

Task 3과 같은 위치에 넣어 admin 앱 내부 route 간 목업 상태를 유지하고, Toaster는 top-center position과 richColors를 사용한다.

- [ ] **Step 2: 관리자 메뉴를 정의한다**

~~~typescript
export const adminNavigationItems = [
  { href: '/', label: '대시보드', icon: LayoutDashboard },
  { href: '/postings', label: '공고 관리', icon: BriefcaseBusiness },
  { href: '/applicants', label: '지원자 관리', icon: UsersRound },
] as const;
~~~

- [ ] **Step 3: 관리자 AppNavigation을 구현한다**

공통 shell은 재사용하되 메뉴·현재 경로·김도윤/취업지원부 계정 카드는 이 앱 내부에만 둔다. client widget이나 데이터를 import하지 않는다.

- [ ] **Step 4: RootLayout에서 관리자 AppNavigation으로 route children을 감싼다**

~~~tsx
<Providers>
  <AppNavigation>{children}</AppNavigation>
</Providers>
~~~

- [ ] **Step 5: 세 route entry를 얇게 구현한다**

각 route file은 DashboardView, PostingsView, ApplicantsView 중 하나만 import해 렌더링한다.

- [ ] **Step 6: admin 라우트를 검증한다**

Run: pnpm --filter admin check-types && pnpm --filter admin lint

Expected: /, /postings, /applicants route type이 생성된다.

- [ ] **Step 7: 커밋한다**

~~~bash
git add apps/admin/src/app apps/admin/src/widgets/app-navigation
git commit -m "add(admin): 관리자 앱 레이아웃과 라우트 추가"
~~~

### Task 6: admin 도메인 UI·기능·views 분리

**Files:**
- Create: apps/admin/src/entities/job/ui/StatusBadge.tsx
- Create: apps/admin/src/entities/application/ui/StatusBadge.tsx
- Create: apps/admin/src/entities/job/index.ts
- Create: apps/admin/src/entities/application/index.ts
- Create: apps/admin/src/features/job-posting/ui/JobPostingForm.tsx
- Create: apps/admin/src/features/job-posting/index.ts
- Create: apps/admin/src/features/job-status/ui/JobStatusButton.tsx
- Create: apps/admin/src/features/job-status/index.ts
- Create: apps/admin/src/features/applicant-result/ui/ApplicantResultButtons.tsx
- Create: apps/admin/src/features/applicant-result/index.ts
- Create: apps/admin/src/views/dashboard/ui/DashboardView.tsx
- Create: apps/admin/src/views/postings/ui/PostingsView.tsx
- Create: apps/admin/src/views/applicants/ui/ApplicantsView.tsx
- Create: index.ts files for each view

**Interfaces:**
- Consumes: shared types/state and UI primitives
- Produces: dashboard, posting management, applicant management views

- [ ] **Step 1: admin StatusBadge를 구현한다**

서류 합격은 success, 서류 불합격과 마감은 secondary, 나머지는 primary 표현을 유지한다.

- [ ] **Step 2: JobPostingForm을 구현한다**

회사명과 포지션만 필수로 검사한다. 성공하면 제공된 기본값을 사용한 새 공고를 최상단에 추가하고 form을 닫고 초기화하며 Discord 알림 success toast를 보인다. 누락 시 error toast만 보인다.

- [ ] **Step 3: JobStatusButton과 ApplicantResultButtons를 구현한다**

~~~tsx
interface JobStatusButtonProps { job: JobType; }
interface ApplicantResultButtonsProps { application: ApplicationType; }
~~~

JobStatusButton은 모집중/마감을 전환한다. ApplicantResultButtons는 합격 또는 불합격 상태를 저장하고 원래의 결과 toast를 보인다.

- [ ] **Step 4: 세 admin view를 조합한다**

DashboardView는 지표·최근 공고·업무 흐름을 표시한다. PostingsView는 form 표시 상태와 공고 table을, ApplicantsView는 회사 filter와 지원자 table·결과 처리·다운로드 placeholder toast를 가진다.

- [ ] **Step 5: admin을 빌드하고 FSD를 검증한다**

Run: pnpm --filter admin build && pnpm lint:fsd

Expected: 새 공고가 최상단에 나타나고 상태 변경이 반영되며 FSD 오류가 없다.

- [ ] **Step 6: 커밋한다**

~~~bash
git add apps/admin/src/entities apps/admin/src/features apps/admin/src/views
git commit -m "add(admin): 채용 관리 화면 분리"
~~~

### Task 7: 전체 통합 검증

**Files:**
- Modify: 검증에서 발견된 직접 회귀 파일만 수정

**Interfaces:**
- Consumes: Tasks 1–6
- Produces: 검증된 두 앱 구현

- [ ] **Step 1: prebuilt UI를 다시 빌드한다**

Run: pnpm --filter @chup/ui build

Expected: packages/ui/dist가 source와 일치한다.

- [ ] **Step 2: 저장소 전체 검증을 실행한다**

~~~bash
pnpm lint
pnpm lint:fsd
pnpm check-types
pnpm build
~~~

Expected: 네 명령이 모두 exit code 0이다.

- [ ] **Step 3: route smoke check를 수행한다**

client에서 /, /jobs, /applications, /profile을, admin에서 /, /postings, /applicants를 연다. 역할 전환 탭이 없고, 각 sidebar는 자기 앱 route만 가리키며, 모바일 메뉴와 목업 토스트가 동작해야 한다.

- [ ] **Step 4: 실제 회귀 수정이 있을 때만 커밋한다**

~~~bash
git add <verified-fix-files>
git commit -m "fix(recruitment): 통합 검증 오류 수정"
~~~

검증 수정이 없으면 이 커밋은 만들지 않는다.
