'use client';

import { type ApiResponseType, post } from '@chup/core/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { applicationUrl } from '../api/endpoints';
import { applicationQueryKeys } from './queryKeys';
import type { ApplicationType, PostApplicationReqType } from './types';

export const usePostApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, jobPositionId }: PostApplicationReqType) => {
      const response = await post<ApiResponseType<ApplicationType>>(
        applicationUrl.postApplication(jobId),
        { jobPositionId },
      );

      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationQueryKeys.all() }),
  });
};
