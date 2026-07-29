import type { GetJobsParamsType } from './types';

export const jobQueryKeys = {
  all: () => ['jobs'] as const,
  getJobs: (params: GetJobsParamsType) => ['jobs', 'list', params] as const,
  getJob: (jobId: number) => ['jobs', 'detail', jobId] as const,
} as const;
