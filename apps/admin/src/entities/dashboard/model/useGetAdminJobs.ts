'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardUrl } from '../api/endpoints';
import { adminDashboardQueryKeys } from './queryKeys';
import type { AdminJobPostingType, GetAdminJobsParamsType } from './types';

export const useGetAdminJobs = (params: GetAdminJobsParamsType = {}) =>
  useQuery({
    queryKey: adminDashboardQueryKeys.getJobs(params),
    queryFn: async () => {
      const response = await get<ApiResponseType<AdminJobPostingType[]>>(
        adminDashboardUrl.getJobs(params.q),
      );

      return response.data;
    },
  });
