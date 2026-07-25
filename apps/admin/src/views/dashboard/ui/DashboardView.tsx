'use client';

import { useRecruitment } from '@chup/core/entities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@chup/ui';
import { BriefcaseBusiness, Clock3, UsersRound } from 'lucide-react';

import { StatusBadge } from '@/entities/application';

const DashboardView = () => {
  const { applications, jobs } = useRecruitment();
  return (
    <div className="flex flex-col gap-7">
      <div>
        <p className="text-primary text-sm font-semibold">관리 대시보드</p>
        <h1 className="mt-1 text-3xl font-bold">좋은 아침이에요, 김도윤 선생님</h1>
        <p className="text-muted-foreground mt-2">오늘 확인할 채용 현황을 모아봤어요.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="모집중 공고"
          value={`${jobs.filter((job) => job.status === '모집중').length}개`}
          note="이번 주 +2"
          icon={BriefcaseBusiness}
        />
        <StatCard
          label="전체 지원자"
          value={`${applications.length}명`}
          note="이번 주 +8"
          icon={UsersRound}
        />
        <StatCard
          label="결과 대기"
          value={`${applications.filter((application) => application.status === '지원 완료').length}명`}
          note="처리가 필요해요"
          icon={Clock3}
        />
        <StatCard
          label="서류 합격"
          value={`${applications.filter((application) => application.status === '서류 합격').length}명`}
          note="이메일 발송 완료"
          icon={UsersRound}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>최근 공고</CardTitle>
          <CardDescription>마감일과 지원 현황을 확인하세요.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between gap-3 rounded-xl p-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{job.company}</p>
                <p className="text-muted-foreground truncate text-sm">
                  {job.positions.join(', ')} · {job.deadline}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{job.applicants}명</span>
                <StatusBadge status={job.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
