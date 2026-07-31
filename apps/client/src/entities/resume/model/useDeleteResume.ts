'use client';

import { del } from '@chup/core/shared';
import { toast } from '@chup/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { resumeUrl } from '../api/endpoints';
import { resumeQueryKeys } from './queryKeys';
import type { ResumeType } from './types';

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: number) => del(resumeUrl.deleteResume(resumeId)),
    onSuccess: (_data, resumeId) => {
      queryClient.setQueryData<ResumeType[]>(resumeQueryKeys.getResumes(), (currentResumes) =>
        (currentResumes ?? []).filter((resume) => resume.id !== resumeId),
      );
      toast.success('이력서가 삭제되었습니다.');
    },
    onError: () => {
      toast.error('이력서 삭제에 실패했습니다.');
    },
  });
};
