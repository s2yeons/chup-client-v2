export const adminDashboardUrl = {
  getDashboard: () => '/api/admin/dashboard',
  getJobs: (q?: string) => (q ? `/api/admin/jobs?q=${encodeURIComponent(q)}` : '/api/admin/jobs'),
  getJob: (jobId: number) => `/api/jobs/${jobId}`,
  postJob: () => '/api/admin/jobs',
  patchJob: (jobId: number) => `/api/admin/jobs/${jobId}`,
  patchJobStatus: (jobId: number) => `/api/admin/jobs/${jobId}/status`,
} as const;
