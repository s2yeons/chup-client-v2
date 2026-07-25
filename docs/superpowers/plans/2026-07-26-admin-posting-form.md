# 어드민 공고 등록 폼 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 어드민이 여러 포지션·마감일·PDF 첨부파일을 포함한 공고를 로컬 상태로 등록하고, 지원자 전화번호를 확인하게 한다.

**Architecture:** `@chup/ui`에는 재사용 가능한 `Calendar`·`Popover` primitive만 추가한다. 어드민 공고 등록의 선택 상태·검증·파일명 변환은 단일 소비처인 `PostingsView`에 유지하고, 첨부파일 파일명은 공유 `JobType`에 저장한다.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, `@base-ui/react`, `react-day-picker`, `@chup/ui`

## Global Constraints

- 실제 공고·파일 업로드 API와 새로고침 후 상태 보존은 추가하지 않는다.
- 첨부파일은 `PDF`만 최대 3개이며, 공고 상태에는 파일명만 보관한다.
- 포지션 기본값은 `프론트엔드`, `백엔드`, `DevOps`, `AI`, `클라우드`이며 직접 입력한 값도 허용한다.
- 회사명·포지션 1개 이상·마감일은 필수이고, 오류는 `@chup/ui`의 `toast`로 알린다.
- `cn()`은 조건부 클래스 또는 외부 `className` 병합에만 사용한다.
- 자동화 테스트 파일은 추가하지 않고, 수동 UI 검증과 기존 정적 검증만 수행한다.
- 완료 전 `pnpm build`, `pnpm lint`, `pnpm lint:fsd`, `pnpm check-types`를 실행한다.

---

## 파일 구조

- 수정: `packages/ui/package.json` — 달력 primitive 의존성을 선언한다.
- 생성: `packages/ui/src/ui/calendar.tsx` — `react-day-picker` 기반 공통 달력 UI를 제공한다.
- 생성: `packages/ui/src/ui/popover.tsx` — `@base-ui/react` 기반 공통 팝오버 UI를 제공한다.
- 수정: `packages/ui/src/index.ts` — 두 공통 primitive를 공개한다.
- 수정: `packages/core/src/entities/recruitment/model/types.ts` — 공고 첨부파일 파일명 배열을 추가한다.
- 수정: `packages/core/src/entities/recruitment/model/mock-data.ts` — 모든 목업 공고의 첨부파일 기본값을 제공한다.
- 수정: `apps/admin/src/views/postings/ui/PostingsView.tsx` — 공고 등록 폼과 로컬 등록 상태를 확장한다.
- 수정: `apps/admin/src/views/applicants/ui/ApplicantsView.tsx` — 전화번호 컬럼을 렌더링한다.

## Task 1: 공통 날짜 선택 primitive 추가

**Files:**

- Modify: `packages/ui/package.json`
- Create: `packages/ui/src/ui/calendar.tsx`
- Create: `packages/ui/src/ui/popover.tsx`
- Modify: `packages/ui/src/index.ts`

**Consumes:** `@base-ui/react`의 `Popover`, `lucide-react` 아이콘

**Produces:** `Calendar`, `Popover`, `PopoverTrigger`, `PopoverContent`

- [ ] **Step 1: `react-day-picker`를 UI 패키지 의존성으로 추가한다.**

Run: `pnpm --filter @chup/ui add react-day-picker`

Expected: `packages/ui/package.json`과 `pnpm-lock.yaml`에만 의존성 변경이 생긴다.

- [ ] **Step 2: `base-nova` 스타일의 팝오버와 달력 primitive를 추가한다.**

`popover.tsx`는 현재 `dropdown-menu.tsx`처럼 `PopoverPrimitive.Root`, `Trigger`, `Portal`, `Positioner`, `Popup`을 감싸고, `PopoverContent`에 `bg-popover`, `rounded-lg`, `shadow-md`, `ring-1` 스타일을 적용한다.

`calendar.tsx`는 `DayPicker`의 `mode`, `selected`, `onSelect` props를 그대로 전달하며 월 이동 버튼에 `ChevronLeftIcon`, `ChevronRightIcon`을 사용한다.

```tsx
const Calendar = ({ className, classNames, ...props }: React.ComponentProps<typeof DayPicker>) => (
  <DayPicker
    className={cn('p-3', className)}
    classNames={{
      month_caption: 'flex h-8 items-center justify-center px-8',
      day_button: 'flex size-8 items-center justify-center rounded-md text-sm',
      selected: 'bg-primary text-primary-foreground',
      ...classNames,
    }}
    {...props}
  />
);
```

- [ ] **Step 3: public barrel에서 primitive를 내보낸다.**

```ts
export * from './ui/calendar';
export * from './ui/popover';
```

- [ ] **Step 4: UI 패키지를 검증한다.**

Run: `pnpm --filter @chup/ui build && pnpm --filter @chup/ui lint && pnpm --filter @chup/ui check-types`

Expected: 세 명령이 성공하고 `Calendar`와 `Popover`를 `@chup/ui`에서 import할 수 있다.

- [ ] **Step 5: 커밋한다.**

```bash
git add packages/ui/package.json pnpm-lock.yaml packages/ui/src/ui/calendar.tsx packages/ui/src/ui/popover.tsx packages/ui/src/index.ts
git commit -m "add(ui): 날짜 선택 primitive 추가"
```

## Task 2: 공고 첨부파일 파일명 상태 추가

**Files:**

- Modify: `packages/core/src/entities/recruitment/model/types.ts`
- Modify: `packages/core/src/entities/recruitment/model/mock-data.ts`

**Consumes:** 기존 `JobType`

**Produces:** `JobType.attachments: string[]`

- [ ] **Step 1: 공고 모델에 필수 파일명 배열을 선언한다.**

```ts
export interface JobType {
  // 기존 필드
  attachments: string[];
}
```

- [ ] **Step 2: 기존 모든 목업 공고에 빈 배열을 지정한다.**

```ts
attachments: [],
```

Expected: 기존 공고 소비자는 첨부파일 유무와 관계없이 동일하게 동작한다.

- [ ] **Step 3: 공유 타입을 검증한다.**

Run: `pnpm --filter @chup/core check-types`

Expected: 공유 `JobType`과 목업 데이터가 `attachments`를 제공한다. 기존 어드민 공고 생성 객체의 `attachments` 추가는 다음 Task 3에서 처리하고, 앱 전체 타입 검증은 Task 4에서 수행한다.

- [ ] **Step 4: 커밋한다.**

```bash
git add packages/core/src/entities/recruitment/model/types.ts packages/core/src/entities/recruitment/model/mock-data.ts
git commit -m "update(job): 공고 첨부파일 필드 추가"
```

## Task 3: 공고 등록 폼의 포지션·날짜·첨부파일 입력 추가

**Files:**

- Modify: `apps/admin/src/views/postings/ui/PostingsView.tsx`

**Consumes:** `Calendar`, `Popover`, `PopoverContent`, `PopoverTrigger`, `Button`, `Input`, `toast`, `JobType.attachments`

**Produces:** 다중 포지션·마감일·PDF 첨부파일을 갖는 새 공고 로컬 상태

- [ ] **Step 1: 폼 상태와 정적 기본 포지션 목록을 선언한다.**

```tsx
const POSITION_OPTIONS = ['프론트엔드', '백엔드', 'DevOps', 'AI', '클라우드'];

const [positions, setPositions] = useState<string[]>([]);
const [customPosition, setCustomPosition] = useState<string>('');
const [deadline, setDeadline] = useState<Date | undefined>();
const [attachments, setAttachments] = useState<File[]>([]);
```

- [ ] **Step 2: 포지션 토글과 직접 추가를 구현한다.**

```tsx
const togglePosition = (position: string) =>
  setPositions((currentPositions) =>
    currentPositions.includes(position)
      ? currentPositions.filter((currentPosition) => currentPosition !== position)
      : [...currentPositions, position],
  );

const addCustomPosition = () => {
  const position = customPosition.trim();
  if (!position || positions.includes(position)) return;
  setPositions((currentPositions) => [...currentPositions, position]);
  setCustomPosition('');
};
```

기본 포지션과 직접 추가한 포지션 모두 `Button` 칩으로 렌더링하고, 선택된 칩은 `default`, 선택되지 않은 기본 칩은 `outline` variant를 사용한다. 직접 추가한 선택 칩에는 삭제 아이콘을 둔다.

- [ ] **Step 3: `Date Picker`와 날짜 형식 변환을 구현한다.**

```tsx
const formatDeadline = (date: Date) =>
  `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
```

`PopoverTrigger` 안의 버튼은 날짜 미선택 시 `마감일을 선택해주세요`, 선택 시 `formatDeadline(deadline)`을 표시한다. `Calendar`는 `mode="single"`, `selected={deadline}`, `onSelect={setDeadline}`을 사용하고 날짜 선택 뒤 팝오버를 닫는다.

- [ ] **Step 4: PDF 첨부파일 추가·삭제와 최대 개수 검증을 구현한다.**

```tsx
const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file && file.type !== 'application/pdf') toast.error('PDF 파일만 추가할 수 있습니다.');
  if (file?.type === 'application/pdf' && attachments.length < 3) {
    setAttachments((currentAttachments) => [...currentAttachments, file]);
  }
  event.target.value = '';
};
```

파일명 목록에는 삭제 버튼을 두며, 3개일 때 파일 입력을 `disabled`로 만들고 `최대 3개까지 등록할 수 있습니다`를 표시한다.

- [ ] **Step 5: 등록 검증과 공고 생성 값을 교체한다.**

```tsx
if (!company.trim() || positions.length === 0 || !deadline) {
  toast.error('회사명, 모집 포지션, 마감일을 입력해주세요.');
  return;
}

const job = {
  id: Date.now(),
  company: company.trim(),
  positions,
  deadline: formatDeadline(deadline),
  attachments: attachments.map((file) => file.name),
  // 기존 description, employment, applicants, status 값을 유지한다.
};
```

등록 뒤 회사명·포지션·직접 입력값·마감일·첨부파일을 모두 초기화한다. `dday`는 선택 마감일과 오늘의 자정 차이를 일 단위로 계산해 기존 `JobType` 필수 필드를 채운다.

- [ ] **Step 6: 수동 동작을 확인한다.**

1. `새 공고 등록`에서 기본 포지션 두 개와 직접 입력 포지션 하나를 선택한다.
2. 날짜를 선택하고 PDF 두 개를 추가한 뒤 하나를 삭제한다.
3. 등록 후 새 행에 선택 포지션과 `YYYY.MM.DD` 마감일이 보이는지 확인한다.
4. 회사명·포지션·마감일을 각각 비운 상태와 비PDF 파일에서 오류 토스트가 보이는지, 파일이 3개일 때 입력이 비활성화되고 최대 개수 안내가 보이는지 확인한다.

- [ ] **Step 7: 커밋한다.**

```bash
git add apps/admin/src/views/postings/ui/PostingsView.tsx
git commit -m "update(posting): 공고 등록 입력 확장"
```

## Task 4: 지원자 목록 전화번호 컬럼 추가 및 전체 검증

**Files:**

- Modify: `apps/admin/src/views/applicants/ui/ApplicantsView.tsx`

**Consumes:** `ApplicationType.phone`

**Produces:** 지원자별 전화번호가 보이는 테이블

- [ ] **Step 1: 테이블 헤더와 행에 전화번호를 추가한다.**

```tsx
<th className="px-5 py-3 font-medium">전화번호</th>
// 같은 열 순서의 tbody
<td className="px-5 py-4">{application.phone}</td>
```

테이블 `min-w` 값을 전화번호 열이 추가된 폭에 맞게 늘리고, 현재 이름·학번·이메일 표시를 보존한다.

- [ ] **Step 2: 수동으로 전화번호 표시를 확인한다.**

Run: `pnpm --filter admin dev`

Expected: `/applicants`에서 모든 지원자의 이름·학번·이메일과 별도 전화번호 컬럼이 가로 스크롤에서도 보인다.

- [ ] **Step 3: 전체 정적 검증을 실행한다.**

Run: `pnpm build && pnpm lint && pnpm lint:fsd && pnpm check-types`

Expected: 모든 명령이 성공한다.

- [ ] **Step 4: 커밋한다.**

```bash
git add apps/admin/src/views/applicants/ui/ApplicantsView.tsx
git commit -m "update(applicant): 전화번호 컬럼 추가"
```
