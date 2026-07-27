'use client';

import { authUrl, post } from '@chup/core/shared';
import { toast } from '@chup/ui';
import { useMutation } from '@tanstack/react-query';

export const usePostLogout = () =>
  useMutation({
    mutationFn: () => post(authUrl.postLogout()),
    onSuccess: () => {
      location.href = '/signin';
    },
    onError: () => {
      toast.error('로그아웃에 실패했어요. 다시 시도해주세요.');
    },
  });
