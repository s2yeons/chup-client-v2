'use client';

import type { JobType } from '@chup/core/entities';
import { useRecruitment } from '@chup/core/entities';
import { Button, toast } from '@chup/ui';
import { Send } from 'lucide-react';

interface ApplyButtonProps {
  job: JobType;
  position: string;
  onComplete: () => void;
}

const ApplyButton = ({ job, position, onComplete }: ApplyButtonProps) => {
  const { applications, setApplications } = useRecruitment();

  const handleApply = () => {
    const hasApplied = applications.some(
      (application) =>
        application.name === '김도윤' &&
        application.company === job.company &&
        application.position === position,
    );

    if (hasApplied) {
      toast.error('이미 지원한 포지션입니다.');
      return;
    }

    setApplications((currentApplications) => [
      {
        id: Date.now(),
        name: '김도윤',
        studentId: '2314',
        company: job.company,
        position,
        date: '2026.07.20 12:00',
        email: 'doyun@gsm.hs.kr',
        phone: '010-2381-7721',
        status: '지원 완료',
      },
      ...currentApplications,
    ]);
    onComplete();
    toast.success(`${job.company} ${position} 포지션에 지원했습니다.`);
  };

  return (
    <Button className="mt-4 w-full" size="lg" onClick={handleApply}>
      이 포지션에 지원하기
      <Send data-icon="inline-end" />
    </Button>
  );
};

export default ApplyButton;
