'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { jobUrl } from '../api/endpoints';
import { jobQueryKeys } from './queryKeys';
import type { JobPostingDetailType } from './types';

export const useGetJob = (jobId: number) =>
  useQuery({
    queryKey: jobQueryKeys.getJob(jobId),
    queryFn: async () => {
      const response = await get<ApiResponseType<JobPostingDetailType>>(jobUrl.getJob(jobId));

      return response.data;
    },
    enabled: jobId > 0,
  });
