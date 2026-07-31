'use client';

import { useState } from 'react';

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@chup/ui';
import { Send } from 'lucide-react';

import { usePostApplication } from '@/entities/application';
import type { JobPositionType } from '@/entities/job';
import { useGetResumes } from '@/entities/resume';

interface ApplyButtonProps {
  jobId: number;
  position: JobPositionType;
  onComplete: () => void;
}

const ApplyButton = ({ jobId, position, onComplete }: ApplyButtonProps) => {
  const { data: resumes } = useGetResumes();
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const { isPending, mutate: postApplication } = usePostApplication();

  const resumeId = selectedResumeId ?? resumes?.[0]?.id;

  const handleApply = () => {
    if (!resumeId) return;

    postApplication(
      { jobId, jobPositionId: position.id, resumeId },
      {
        onSuccess: () => {
          onComplete();
          toast.success(`${position.name} 포지션에 지원했습니다.`);
        },
        onError: () => toast.error('지원에 실패했어요. 다시 시도해주세요.'),
      },
    );
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Select
        value={resumeId ?? null}
        onValueChange={(value) => setSelectedResumeId(value as number)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="제출할 이력서를 선택해주세요" />
        </SelectTrigger>
        <SelectContent side="bottom" align="start" alignItemWithTrigger={false}>
          {resumes?.map((resume) => (
            <SelectItem key={resume.id} value={resume.id}>
              {resume.fileName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {resumes?.length === 0 && (
        <p className="text-destructive text-sm">
          지원하려면 프로필에서 이력서를 먼저 등록해주세요.
        </p>
      )}
      <Button className="w-full" size="lg" disabled={isPending || !resumeId} onClick={handleApply}>
        이 포지션에 지원하기
        <Send data-icon="inline-end" />
      </Button>
    </div>
  );
};

export default ApplyButton;
