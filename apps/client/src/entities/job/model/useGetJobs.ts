'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { jobUrl } from '../api/endpoints';
import { jobQueryKeys } from './queryKeys';
import type { GetJobsParamsType, JobPostingSummaryType } from './types';

export const useGetJobs = (params: GetJobsParamsType) =>
  useQuery({
    queryKey: jobQueryKeys.getJobs(params),
    queryFn: async () => {
      const response = await get<ApiResponseType<JobPostingSummaryType[]>>(jobUrl.getJobs(params));

      return response.data;
    },
  });
