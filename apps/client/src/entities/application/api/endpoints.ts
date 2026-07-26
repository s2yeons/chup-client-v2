export const applicationUrl = {
  getApplications: () => '/api/applications',
  postApplication: (jobId: number) => `/api/jobs/${jobId}/applications`,
} as const;
