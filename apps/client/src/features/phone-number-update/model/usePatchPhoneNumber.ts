'use client';

import { userQueryKeys, type UserType, userUrl } from '@chup/core/entities';
import { type ApiResponseType, patch } from '@chup/core/shared';
import { toast } from '@chup/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { PhoneNumberUpdateReqType } from './schema';

export const usePatchPhoneNumber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: PhoneNumberUpdateReqType) => {
      const response = await patch<ApiResponseType<UserType>>(userUrl.patchPhoneNumber(), body);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all() });
      toast.success('전화번호가 저장되었습니다.');
    },
    onError: () => {
      toast.error('전화번호 저장에 실패했습니다.');
    },
  });
};
