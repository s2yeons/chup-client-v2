export const applicationQueryKeys = {
  all: () => ['applications'] as const,
  getApplications: () => ['applications', 'list'] as const,
} as const;
