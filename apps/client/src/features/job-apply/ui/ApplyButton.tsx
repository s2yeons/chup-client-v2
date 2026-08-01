'use client';

import { useState } from 'react';

import { Button, toast } from '@chup/ui';
import { FileText, Send } from 'lucide-react';

import { usePostApplication } from '@/entities/application';
import type { JobPositionType } from '@/entities/job';
import { useGetResumes } from '@/entities/resume';
import { useGetMe } from '@/entities/user';

interface ApplyButtonProps {
  jobId: number;
  position: JobPositionType;
  onComplete: () => void;
}

const ApplyButton = ({ jobId, position, onComplete }: ApplyButtonProps) => {
  const { data: resumes } = useGetResumes();
  const { data: user } = useGetMe();
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const { isPending, mutate: postApplication } = usePostApplication();

  const resumeId = selectedResumeId ?? resumes?.[0]?.id;

  const handleApply = () => {
    if (!resumeId || !user?.phoneNumber) return;

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
      {resumes && resumes.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">제출할 이력서</p>
          {resumes.map((resume) => (
            <Button
              key={resume.id}
              variant={resumeId === resume.id ? 'secondary' : 'outline'}
              className="h-auto w-full justify-start p-3 text-left"
              aria-pressed={resumeId === resume.id}
              onClick={() => setSelectedResumeId(resume.id)}
            >
              <FileText className="text-primary size-4" />
              <span className="truncate">{resume.fileName}</span>
            </Button>
          ))}
        </div>
      )}
      {resumes?.length === 0 && (
        <p className="text-destructive text-sm">
          지원하려면 프로필에서 이력서를 먼저 등록해주세요.
        </p>
      )}
      {user && !user.phoneNumber && (
        <p className="text-destructive text-sm">
          지원하려면 프로필에서 전화번호를 먼저 등록해주세요.
        </p>
      )}
      <Button
        className="w-full"
        size="lg"
        disabled={isPending || !resumeId || !user?.phoneNumber}
        onClick={handleApply}
      >
        이 포지션에 지원하기
        <Send data-icon="inline-end" />
      </Button>
    </div>
  );
};

export default ApplyButton;
