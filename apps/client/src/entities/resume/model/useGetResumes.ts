'use client';

import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

import { resumeUrl } from '../api/endpoints';
import { resumeQueryKeys } from './queryKeys';
import type { ResumeType } from './types';

export const useGetResumes = () =>
  useQuery({
    queryKey: resumeQueryKeys.getResumes(),
    queryFn: async () => {
      const response = await get<ApiResponseType<ResumeType[]>>(resumeUrl.getResumes());

      return response.data;
    },
  });
