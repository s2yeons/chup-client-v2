export const applicationUrl = {
  getApplications: () => '/applications',
  postApplication: (jobId: number) => `/jobs/${jobId}/applications`,
} as const;
