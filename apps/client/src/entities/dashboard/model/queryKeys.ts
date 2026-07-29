export const dashboardQueryKeys = {
  all: () => ['dashboard'] as const,
  getDashboard: () => ['dashboard', 'student'] as const,
} as const;
