'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardUrl } from '../api/endpoints';
import { adminDashboardQueryKeys } from './queryKeys';
import type { AdminJobPostingDetailType } from './types';

export const useGetAdminJob = (jobId?: number) =>
  useQuery({
    queryKey: adminDashboardQueryKeys.getJob(jobId),
    queryFn: async () => {
      const response = await get<ApiResponseType<AdminJobPostingDetailType>>(
        adminDashboardUrl.getJob(jobId!),
      );

      return response.data;
    },
    enabled: !!jobId,
  });
