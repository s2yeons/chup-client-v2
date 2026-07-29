'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { adminDashboardUrl } from '../api/endpoints';
import { adminDashboardQueryKeys } from './queryKeys';
import type { AdminDashboardType } from './types';

export const useGetAdminDashboard = () =>
  useQuery({
    queryKey: adminDashboardQueryKeys.getDashboard(),
    queryFn: async () => {
      const response = await get<ApiResponseType<AdminDashboardType>>(
        adminDashboardUrl.getDashboard(),
      );

      return response.data;
    },
  });
