export const resumeQueryKeys = {
  all: () => ['resume'] as const,
  getResumes: () => ['resume', 'list'] as const,
} as const;
