'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { dashboardUrl } from '../api/endpoints';
import { dashboardQueryKeys } from './queryKeys';
import type { StudentDashboardType } from './types';

export const useGetStudentDashboard = () =>
  useQuery({
    queryKey: dashboardQueryKeys.getDashboard(),
    queryFn: async () => {
      const response = await get<ApiResponseType<StudentDashboardType>>(
        dashboardUrl.getDashboard(),
      );

      return response.data;
    },
  });
