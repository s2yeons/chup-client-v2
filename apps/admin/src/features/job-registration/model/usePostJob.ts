'use client';

import { type ApiResponseType, post } from '@chup/core/shared';
import { toast } from '@chup/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  adminDashboardQueryKeys,
  adminDashboardUrl,
  type AdminJobPostingType,
} from '@/entities/dashboard';

import { getJobRequestUrl } from './getJobRequestUrl';
import type { JobRegistrationReqType } from './schema';

export const usePostJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: JobRegistrationReqType) => {
      const formData = new FormData();
      body.attachments.forEach((attachment) => formData.append('attachments', attachment));

      const response = await post<ApiResponseType<AdminJobPostingType>>(
        getJobRequestUrl(adminDashboardUrl.postJob(), body),
        formData,
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminDashboardQueryKeys.all() });
      toast.success('공고가 등록되었습니다.');
    },
  });
};
