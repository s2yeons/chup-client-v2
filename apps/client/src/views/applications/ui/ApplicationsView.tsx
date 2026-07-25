'use client';

import { useRecruitment } from '@chup/core/entities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from '@chup/ui';
import { Clock3, Send, UserRoundCheck } from 'lucide-react';

import { StatusBadge } from '@/entities/application';

const ApplicationsView = () => {
  const { applications } = useRecruitment();
  const myApplications = applications.filter((application) => application.name === '김도윤');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-primary text-sm font-semibold">지원 현황</p>
        <h1 className="mt-1 text-3xl font-bold">지원 여정을 확인하세요</h1>
        <p className="text-muted-foreground mt-2">
          제출한 지원서와 전형 결과를 한눈에 확인할 수 있어요.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="전체 지원"
          value={`${myApplications.length}건`}
          note="누적 지원 수"
          icon={Send}
        />
        <StatCard
          label="검토 중"
          value={`${myApplications.filter((application) => application.status === '지원 완료').length}건`}
          note="결과를 기다리고 있어요"
          icon={Clock3}
        />
        <StatCard
          label="합격"
          value={`${myApplications.filter((application) => application.status === '서류 합격').length}건`}
          note="축하해요!"
          icon={UserRoundCheck}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>지원 내역</CardTitle>
          <CardDescription>최근 지원 순으로 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {myApplications.map((application) => (
            <div
              key={application.id}
              className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-secondary text-primary flex size-11 items-center justify-center rounded-xl font-bold">
                  {application.company.slice(0, 1)}
                </div>
                <div>
                  <p className="font-semibold">
                    {application.company} · {application.position}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">{application.date} 지원</p>
                </div>
              </div>
              <StatusBadge status={application.status} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationsView;
