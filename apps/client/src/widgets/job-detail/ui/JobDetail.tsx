'use client';

import { useState } from 'react';

import type { JobType } from '@chup/core/entities';
import { Badge, Button, Separator } from '@chup/ui';
import { Download, FileText, X } from 'lucide-react';
import { toast } from 'sonner';

import { ApplyButton } from '@/features/job-apply';

interface JobDetailProps {
  job: JobType;
  onClose: () => void;
}

const JobDetail = ({ job, onClose }: JobDetailProps) => {
  const [position, setPosition] = useState<string>(job.positions[0]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20" onMouseDown={onClose}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-background p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">모집중 · D-{job.dday}</Badge>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="상세 닫기">
            <X />
          </Button>
        </div>
        <div className="mt-8 flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl font-bold text-primary">
            {job.company.slice(0, 1)}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{job.company}</p>
            <h2 className="mt-1 text-balance text-2xl font-bold">{job.positions.join(' · ')} 채용</h2>
          </div>
        </div>
        <Separator className="my-7" />
        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="text-sm text-muted-foreground">고용 형태</p>
            <p className="mt-1 font-semibold">{job.employment}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">모집 기간</p>
            <p className="mt-1 font-semibold">~ {job.deadline}</p>
          </div>
        </div>
        <section className="mt-8">
          <h3 className="font-bold">회사 소개</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {job.description} 학생 여러분의 가능성과 성장을 중요하게 생각하며, 함께 새로운 서비스를 만들어갈 동료를 기다리고 있습니다.
          </p>
        </section>
        <section className="mt-8">
          <h3 className="font-bold">모집 포지션</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {job.positions.map((jobPosition) => (
              <Button
                key={jobPosition}
                size="sm"
                variant={position === jobPosition ? 'default' : 'outline'}
                onClick={() => setPosition(jobPosition)}
              >
                {jobPosition}
              </Button>
            ))}
          </div>
        </section>
        <section className="mt-8">
          <h3 className="font-bold">첨부파일</h3>
          <Button
            variant="outline"
            className="mt-3 h-auto w-full justify-between p-4 text-left"
            onClick={() => toast.success('채용공고.pdf 다운로드를 시작합니다.')}
          >
            <span className="flex items-center gap-3">
              <FileText className="size-5 text-primary" />
              <span>
                <strong className="block text-sm">{job.company}_채용공고.pdf</strong>
                <span className="text-xs text-muted-foreground">PDF · 2.4 MB</span>
              </span>
            </span>
            <Download className="size-4" />
          </Button>
        </section>
        <div className="mt-10 rounded-2xl bg-secondary p-4">
          <div className="flex items-center gap-3">
            <FileText className="size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">김도윤_2314_이력서.pdf</p>
              <p className="text-xs text-muted-foreground">등록된 이력서로 지원합니다.</p>
            </div>
          </div>
        </div>
        <ApplyButton job={job} position={position} onComplete={onClose} />
      </div>
    </div>
  );
};

export default JobDetail;
