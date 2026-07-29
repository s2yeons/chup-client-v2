import type { GetAdminJobsParamsType } from './types';

export const adminDashboardQueryKeys = {
  all: () => ['admin-dashboard'] as const,
  getDashboard: () => ['admin-dashboard', 'summary'] as const,
  getJobs: (params: GetAdminJobsParamsType = {}) => ['admin-dashboard', 'jobs', params] as const,
  getJob: (jobId?: number) => ['admin-dashboard', 'job', jobId] as const,
} as const;
