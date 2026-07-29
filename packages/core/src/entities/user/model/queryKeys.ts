export const userQueryKeys = {
  all: () => ['users'] as const,
  getMe: () => ['users', 'me'] as const,
} as const;
