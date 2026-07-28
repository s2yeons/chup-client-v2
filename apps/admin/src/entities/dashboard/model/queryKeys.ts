export const adminDashboardQueryKeys = {
  all: () => ['admin-dashboard'] as const,
  getDashboard: () => ['admin-dashboard', 'summary'] as const,
  getJobs: () => ['admin-dashboard', 'jobs'] as const,
} as const;
