'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { resumeUrl } from '../api/endpoints';
import { isNotFoundError } from '../lib/isNotFoundError';
import { resumeQueryKeys } from './queryKeys';
import type { ResumeType } from './types';

export const useGetResume = () =>
  useQuery({
    queryKey: resumeQueryKeys.getResume(),
    queryFn: async () => {
      try {
        const response = await get<ApiResponseType<ResumeType>>(resumeUrl.getResume());

        return response.data;
      } catch (error) {
        if (isNotFoundError(error)) return null;
        throw error;
      }
    },
  });
