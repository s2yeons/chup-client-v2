export const resumeQueryKeys = {
  all: () => ['resume'] as const,
  getResume: () => ['resume', 'me'] as const,
} as const;
