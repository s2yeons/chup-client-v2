'use client';

import { type ApiResponseType, patch } from '@chup/core/shared';
import { toast } from '@chup/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  adminDashboardQueryKeys,
  adminDashboardUrl,
  type AdminJobPostingType,
  type JobStatusType,
} from '@/entities/dashboard';

interface PatchJobStatusParamsType {
  jobId: number;
  status: JobStatusType;
}

export const usePatchJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, status }: PatchJobStatusParamsType) => {
      const response = await patch<ApiResponseType<AdminJobPostingType>>(
        adminDashboardUrl.patchJobStatus(jobId),
        { status },
      );

      return response.data;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKeys.all() });
      toast.success(status === 'CLOSED' ? '공고를 마감했습니다.' : '모집을 재개했습니다.');
    },
    onError: () => toast.error('공고 상태 변경에 실패했습니다.'),
  });
};
