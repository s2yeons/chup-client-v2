'use client';

import { Button, toast } from '@chup/ui';
import { Send } from 'lucide-react';

import { usePostApplication } from '@/entities/application';
import type { JobPositionType } from '@/entities/job';

interface ApplyButtonProps {
  jobId: number;
  position: JobPositionType;
  onComplete: () => void;
}

const ApplyButton = ({ jobId, position, onComplete }: ApplyButtonProps) => {
  const { isPending, mutate: postApplication } = usePostApplication();

  const handleApply = () => {
    postApplication(
      { jobId, jobPositionId: position.id },
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
    <Button className="mt-4 w-full" size="lg" disabled={isPending} onClick={handleApply}>
      이 포지션에 지원하기
      <Send data-icon="inline-end" />
    </Button>
  );
};

export default ApplyButton;
