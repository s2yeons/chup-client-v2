'use client';

import { useState } from 'react';

import type { JobType } from '@chup/core/entities';
import { useRecruitment } from '@chup/core/entities';
import { Badge, Button, StatCard } from '@chup/ui';
import { BriefcaseBusiness, ChevronRight, Send, Sparkles, UserRoundCheck } from 'lucide-react';

import { JobCard } from '@/entities/job';
import { JobDetail } from '@/widgets/job-detail';

const HomeView = () => {
  const { applications, jobs } = useRecruitment();
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const activeJobs = jobs.filter((job) => job.status === '모집중');
  const myApplications = applications.filter((application) => application.name === '김도윤');

  return (
    <div className="flex flex-col gap-7">
      <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground md:p-8">
        <div className="relative z-10 max-w-xl">
          <Badge className="bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/15">
            <Sparkles /> 이번 주 신규 공고 3개
          </Badge>
          <h1 className="mt-5 text-balance text-3xl leading-tight font-bold md:text-4xl">
            꿈꾸는 커리어의 시작,
            <br />한 곳에서 빠르게.
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/80 md:text-base">
            학교에 도착한 채용 소식을 확인하고, 등록한 이력서로 간편하게 지원하세요.
          </p>
          <Button variant="secondary" className="mt-6" onClick={() => (window.location.href = '/jobs')}>
            공고 둘러보기
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
        <BriefcaseBusiness className="absolute -right-8 -bottom-10 size-52 text-primary-foreground/10" />
      </section>
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="모집중 공고" value={`${activeJobs.length}개`} note="지금 지원할 수 있어요" icon={BriefcaseBusiness} />
        <StatCard label="나의 지원" value={`${myApplications.length}건`} note="최근 지원 현황" icon={Send} />
        <StatCard
          label="서류 합격"
          value={`${myApplications.filter((application) => application.status === '서류 합격').length}건`}
          note="새로운 결과가 있어요"
          icon={UserRoundCheck}
        />
      </section>
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">추천 공고</p>
            <h2 className="mt-1 text-2xl font-bold">놓치면 아쉬운 채용 소식</h2>
          </div>
          <Button variant="ghost" onClick={() => (window.location.href = '/jobs')}>
            전체 보기
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {activeJobs.slice(0, 3).map((job) => (
            <JobCard key={job.id} job={job} onOpen={setSelectedJob} />
          ))}
        </div>
      </section>
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default HomeView;
