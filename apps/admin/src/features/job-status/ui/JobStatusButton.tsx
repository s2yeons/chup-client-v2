'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@chup/ui';
import { MoreHorizontal } from 'lucide-react';

import { type AdminJobPostingType } from '@/entities/dashboard';

import { usePatchJobStatus } from '../model/usePatchJobStatus';

interface JobStatusButtonProps {
  job: AdminJobPostingType;
  onEdit: (job: AdminJobPostingType) => void;
}

const JobStatusButton = ({ job, onEdit }: JobStatusButtonProps) => {
  const { mutate: patchJobStatus, isPending } = usePatchJobStatus();
  const nextStatus = job.status === 'RECRUITING' ? 'CLOSED' : 'RECRUITING';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label="공고 상태 메뉴" />}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => patchJobStatus({ jobId: job.id, status: nextStatus })}
          disabled={isPending}
        >
          {job.status === 'RECRUITING' ? '공고 마감' : '모집 재개'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit(job)}>공고 수정</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobStatusButton;
