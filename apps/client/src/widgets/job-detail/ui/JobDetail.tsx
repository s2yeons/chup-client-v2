'use client';

import { useState } from 'react';

import { Badge, Button, Separator } from '@chup/ui';
import { CircleAlert, Download, FileText, Loader2, X } from 'lucide-react';

import { employmentTypeMeta, jobUrl, useGetJob } from '@/entities/job';
import { ApplyButton } from '@/features/job-apply';

interface JobDetailProps {
  jobId: number;
  onClose: () => void;
}

const JobDetail = ({ jobId, onClose }: JobDetailProps) => {
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);
  const { data: job, isError, isPending } = useGetJob(jobId);
  const positionId = selectedPositionId ?? job?.positions[0]?.id;
  const position = job?.positions.find((jobPosition) => jobPosition.id === positionId);

  return (
    <div className="bg-foreground/20 fixed inset-0 z-50 flex justify-end" onMouseDown={onClose}>
      <div
        className="bg-sidebar h-full w-full max-w-xl overflow-y-auto p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">채용 공고</Badge>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="상세 닫기">
            <X />
          </Button>
        </div>
        {isPending && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-20 text-sm">
            <Loader2 className="size-5 animate-spin" />
            공고 상세를 불러오는 중이에요.
          </div>
        )}
        {isError && (
          <div className="text-muted-foreground flex flex-col items-center gap-2 py-20 text-sm">
            <CircleAlert className="size-5" />
            공고 상세를 불러오지 못했어요. 잠시 후 다시 시도해주세요.
          </div>
        )}
        {job && (
          <>
            <div className="mt-8 flex items-start gap-4">
              <div className="bg-secondary text-primary flex size-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold">
                {job.companyName.slice(0, 1)}
              </div>
              <div>
                <p className="text-muted-foreground text-sm">{job.companyName}</p>
                <h2 className="mt-1 text-2xl font-bold text-balance">채용 공고</h2>
              </div>
            </div>
            <Separator className="my-7" />
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="text-muted-foreground text-sm">고용 형태</p>
                <p className="mt-1 font-semibold">{employmentTypeMeta[job.employmentType].label}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">모집 기간</p>
                <p className="mt-1 font-semibold">
                  {job.recruitStart} ~ {job.recruitEnd}
                </p>
              </div>
            </div>
            <section className="mt-8">
              <h3 className="font-bold">회사 소개</h3>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {job.description}
              </p>
            </section>
            <section className="mt-8">
              <h3 className="font-bold">모집 포지션</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {job.positions.map((jobPosition) => (
                  <Button
                    key={jobPosition.id}
                    size="sm"
                    variant={positionId === jobPosition.id ? 'default' : 'outline'}
                    onClick={() => setSelectedPositionId(jobPosition.id)}
                  >
                    {jobPosition.name}
                  </Button>
                ))}
              </div>
            </section>
            {job.attachments.length > 0 && (
              <section className="mt-8">
                <h3 className="font-bold">첨부파일</h3>
                <div className="mt-3 space-y-2">
                  {job.attachments.map((attachment) => (
                    <Button
                      key={attachment.id}
                      variant="outline"
                      className="h-auto w-full justify-between p-4 text-left"
                      nativeButton={false}
                      render={<a href={jobUrl.getAttachment(job.id, attachment.id)} download />}
                    >
                      <span className="flex items-center gap-3">
                        <FileText className="text-primary size-5" />
                        <strong className="text-sm">{attachment.fileName}</strong>
                      </span>
                      <Download className="size-4" />
                    </Button>
                  ))}
                </div>
              </section>
            )}
            {position && <ApplyButton jobId={job.id} position={position} onComplete={onClose} />}
          </>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
