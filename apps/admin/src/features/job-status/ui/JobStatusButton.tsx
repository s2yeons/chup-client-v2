'use client';

import type { JobType } from '@chup/core/entities';
import { useRecruitment } from '@chup/core/entities';
import { Button } from '@chup/ui';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface JobStatusButtonProps {
  job: JobType;
}

const JobStatusButton = ({ job }: JobStatusButtonProps) => {
  const { setJobs } = useRecruitment();
  const handleClick = () => {
    setJobs((jobs) =>
      jobs.map((currentJob) =>
        currentJob.id === job.id
          ? { ...currentJob, status: currentJob.status === '모집중' ? '마감' : '모집중' }
          : currentJob,
      ),
    );
    toast.success('공고 상태가 변경되었습니다.');
  };
  return (
    <Button variant="ghost" size="icon" onClick={handleClick} aria-label="상태 변경">
      <MoreHorizontal />
    </Button>
  );
};

export default JobStatusButton;
