'use client';

import { userQueryKeys, type UserType, userUrl } from '@chup/core/entities';
import { type ApiResponseType, get } from '@chup/core/shared';
import { useQuery } from '@tanstack/react-query';

export const useGetMe = (enabled = true) =>
  useQuery({
    queryKey: userQueryKeys.getMe(),
    queryFn: async () => {
      const response = await get<ApiResponseType<UserType>>(userUrl.getMe());

      return response.data;
    },
    enabled,
  });
