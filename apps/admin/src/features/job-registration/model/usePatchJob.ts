'use client';

import { type ApiResponseType, patch } from '@chup/core/shared';
import { toast } from '@chup/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  adminDashboardQueryKeys,
  adminDashboardUrl,
  type AdminJobPostingType,
} from '@/entities/dashboard';

import { getJobRequestUrl } from './getJobRequestUrl';
import type { JobRegistrationReqType } from './schema';

interface PatchJobParamsType {
  jobId: number;
  body: JobRegistrationReqType;
  retainedAttachmentIds?: number[];
}

export const usePatchJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, body, retainedAttachmentIds }: PatchJobParamsType) => {
      const formData = new FormData();
      body.attachments.forEach((attachment) => formData.append('attachments', attachment));

      const response = await patch<ApiResponseType<AdminJobPostingType>>(
        getJobRequestUrl(adminDashboardUrl.patchJob(jobId), body, retainedAttachmentIds),
        formData,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKeys.all() });
      toast.success('공고가 수정되었습니다.');
    },
  });
};
