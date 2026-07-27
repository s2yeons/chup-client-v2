'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardUrl } from '../api/endpoints';
import { adminDashboardQueryKeys } from './queryKeys';
import type { AdminJobPostingType } from './types';

export const useGetAdminJobs = () =>
  useQuery({
    queryKey: adminDashboardQueryKeys.getJobs(),
    queryFn: async () => {
      const response = await get<ApiResponseType<AdminJobPostingType[]>>(
        adminDashboardUrl.getJobs(),
      );

      return response.data;
    },
  });
