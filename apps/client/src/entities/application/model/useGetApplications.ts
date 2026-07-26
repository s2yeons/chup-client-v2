'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { applicationUrl } from '../api/endpoints';
import { applicationQueryKeys } from './queryKeys';
import type { ApplicationType } from './types';

export const useGetApplications = () =>
  useQuery({
    queryKey: applicationQueryKeys.getApplications(),
    queryFn: async () => {
      const response = await get<ApiResponseType<ApplicationType[]>>(
        applicationUrl.getApplications(),
      );

      return response.data;
    },
  });
