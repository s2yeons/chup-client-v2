'use client';

import { type ApiResponseType, put } from '@chup/core/shared';
import { toast } from '@chup/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resumeUrl } from '../api/endpoints';
import { resumeQueryKeys } from './queryKeys';
import type { ResumeType } from './types';

interface PutResumeParamsType {
  file: File;
  onUploadProgress?: (percent: number) => void;
}

export const usePutResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, onUploadProgress }: PutResumeParamsType) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await put<ApiResponseType<ResumeType>>(resumeUrl.putResume(), formData, {
        onUploadProgress: (event) => {
          if (!onUploadProgress || !event.total) return;
          onUploadProgress(Math.round((event.loaded / event.total) * 100));
        },
      });

      return response.data;
    },
    onSuccess: (resume) => {
      queryClient.setQueryData(resumeQueryKeys.getResume(), resume);
      toast.success('이력서가 저장되었습니다.');
    },
    onError: () => {
      toast.error('이력서 업로드에 실패했습니다.');
    },
  });
};
