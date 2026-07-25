'use client';

import { useState } from 'react';

import type { JobType } from '@chup/core/entities';
import { useRecruitment } from '@chup/core/entities';
import { Button, Input } from '@chup/ui';
import { Search, SlidersHorizontal } from 'lucide-react';

import { JobCard } from '@/entities/job';
import { JobDetail } from '@/widgets/job-detail';

const employmentItems = ['전체', '정규직', '인턴', '계약직', '산업기능요원'];

const JobsView = () => {
  const { jobs } = useRecruitment();
  const [query, setQuery] = useState<string>('');
  const [employment, setEmployment] = useState<string>('전체');
  const [selectedJob, setSelectedJob] = useState<JobType | null>(null);
  const filteredJobs = jobs.filter(
    (job) =>
      job.status === '모집중' &&
      `${job.company} ${job.positions.join(' ')}`.toLowerCase().includes(query.toLowerCase()) &&
      (employment === '전체' || job.employment === employment),
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-primary text-sm font-semibold">채용 공고</p>
        <h1 className="mt-1 text-3xl font-bold">나에게 맞는 기회를 찾아보세요</h1>
        <p className="text-muted-foreground mt-2">
          학교로 전달된 모든 공고를 빠르게 확인할 수 있어요.
        </p>
      </div>
      <div className="bg-card flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="회사명 또는 포지션 검색"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {employmentItems.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={employment === item ? 'default' : 'outline'}
              onClick={() => setEmployment(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          총 <strong className="text-foreground">{filteredJobs.length}개</strong>의 공고
        </p>
        <Button variant="ghost" size="sm" onClick={() => undefined}>
          <SlidersHorizontal /> 마감 임박순
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredJobs.map((job) => (
          <JobCard key={job.id} job={job} onOpen={setSelectedJob} />
        ))}
      </div>
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  );
};

export default JobsView;
