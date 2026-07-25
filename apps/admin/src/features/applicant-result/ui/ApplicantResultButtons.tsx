'use client';

import type { ApplicationStatusType, ApplicationType } from '@chup/core/entities';
import { useRecruitment } from '@chup/core/entities';
import { Button, toast } from '@chup/ui';

interface ApplicantResultButtonsProps {
  application: ApplicationType;
}

const ApplicantResultButtons = ({ application }: ApplicantResultButtonsProps) => {
  const { setApplications } = useRecruitment();
  const handleUpdate = (status: ApplicationStatusType) => {
    setApplications((applications) =>
      applications.map((currentApplication) =>
        currentApplication.id === application.id
          ? { ...currentApplication, status }
          : currentApplication,
      ),
    );
    toast.success(
      status === '서류 합격'
        ? '합격 처리 후 안내 이메일을 발송했습니다.'
        : '지원 결과가 변경되었습니다.',
    );
  };
  return (
    <div className="flex gap-1">
      <Button variant="outline" size="sm" onClick={() => handleUpdate('서류 합격')}>
        합격
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleUpdate('서류 불합격')}>
        불합격
      </Button>
    </div>
  );
};

export default ApplicantResultButtons;
