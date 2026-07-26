'use client';

import type { JobType } from '@chup/core/entities';
import { useRecruitment } from '@chup/core/entities';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  toast,
} from '@chup/ui';
import { MoreHorizontal } from 'lucide-react';

interface JobStatusButtonProps {
  job: JobType;
}

const JobStatusButton = ({ job }: JobStatusButtonProps) => {
  const { setJobs } = useRecruitment();
  const handleStatusChange = (status: JobType['status']) => {
    setJobs((jobs) =>
      jobs.map((currentJob) => (currentJob.id === job.id ? { ...currentJob, status } : currentJob)),
    );
    toast.success(status === '마감' ? '공고를 마감했습니다.' : '모집을 재개했습니다.');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="공고 상태 메뉴" />}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleStatusChange(job.status === '모집중' ? '마감' : '모집중')}
        >
          {job.status === '모집중' ? '공고 마감' : '모집 재개'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobStatusButton;
