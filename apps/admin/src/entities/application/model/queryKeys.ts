import type { GetApplicantsParamsType } from './types';

export const applicantQueryKeys = {
  all: () => ['applicants'] as const,
  getApplicants: (params: GetApplicantsParamsType) => ['applicants', 'list', params] as const,
} as const;
