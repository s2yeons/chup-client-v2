'use client';

import { Button, toast } from '@chup/ui';

import type { ApplicationStatusType, ApplicationType } from '@/entities/application';
import { usePatchApplicantResult } from '@/entities/application';

interface ApplicantResultButtonsProps {
  application: ApplicationType;
}

const ApplicantResultButtons = ({ application }: ApplicantResultButtonsProps) => {
  const { isPending, mutate: patchApplicantResult } = usePatchApplicantResult();

  const handleUpdate = (status: ApplicationStatusType) => {
    patchApplicantResult(
      { applicationId: application.id, status },
      {
        onSuccess: () =>
          toast.success(
            status === 'PASSED'
              ? '합격 처리 후 안내 이메일을 발송했습니다.'
              : '지원 결과가 변경되었습니다.',
          ),
        onError: () => toast.error('결과 처리에 실패했어요. 다시 시도해주세요.'),
      },
    );
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => handleUpdate('PASSED')}
      >
        합격
      </Button>
      <Button variant="ghost" size="sm" disabled={isPending} onClick={() => handleUpdate('FAILED')}>
        불합격
      </Button>
    </div>
  );
};

export default ApplicantResultButtons;
