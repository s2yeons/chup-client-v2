'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { applicantUrl } from '../api/endpoints';
import { applicantQueryKeys } from './queryKeys';
import type { ApplicationType, GetApplicantsParamsType } from './types';

export const useGetApplicants = (params: GetApplicantsParamsType = {}) =>
  useQuery({
    queryKey: applicantQueryKeys.getApplicants(params),
    queryFn: async () => {
      const response = await get<ApiResponseType<ApplicationType[]>>(
        applicantUrl.getApplicants(params),
      );

      return response.data;
    },
  });
