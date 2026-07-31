import { API_BASE_URL } from '@chup/core/shared';

import type { GetJobsParamsType } from '../model/types';

export const jobUrl = {
  getJobs: (params: GetJobsParamsType = {}) => {
    const searchParams = new URLSearchParams();

    if (params.q) searchParams.set('q', params.q);
    if (params.position) searchParams.set('position', params.position);
    if (params.employmentType) searchParams.set('employmentType', params.employmentType);
    if (params.sort) searchParams.set('sort', params.sort);

    const queryString = searchParams.toString();

    return queryString ? `/api/jobs?${queryString}` : '/api/jobs';
  },
  getJob: (jobId: number) => `/api/jobs/${jobId}`,
  getAttachment: (jobId: number, fileId: number) =>
    `${API_BASE_URL}/api/jobs/${jobId}/attachments/${fileId}`,
} as const;
