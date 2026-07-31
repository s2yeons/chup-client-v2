'use client';

import { type ApiResponseType, post } from '@chup/core/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { applicationUrl } from '../api/endpoints';
import { applicationQueryKeys } from './queryKeys';
import type { ApplicationType, PostApplicationReqType } from './types';

export const usePostApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, jobPositionId, resumeId }: PostApplicationReqType) => {
      const response = await post<ApiResponseType<ApplicationType>>(
        applicationUrl.postApplication(jobId),
        { jobPositionId, resumeId },
      );

      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationQueryKeys.all() }),
  });
};
