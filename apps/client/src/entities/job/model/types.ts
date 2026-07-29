export type EmploymentType =
  'FULL_TIME' | 'CONTRACT' | 'INTERN' | 'INDUSTRIAL_FUNCTIONAL_PERSONNEL';

export type JobStatusType = 'RECRUITING' | 'CLOSED';

export type JobSortType = 'deadline_asc';

export interface GetJobsParamsType {
  q?: string;
  position?: string;
  employmentType?: EmploymentType;
  sort?: JobSortType;
}

export interface JobPostingType {
  id: number;
  companyName: string;
  description: string;
  employmentType: EmploymentType;
  recruitStart: string;
  recruitEnd: string;
  status: JobStatusType;
  createdAt: string;
}

export interface JobPositionType {
  id: number;
  name: string;
}

export interface AttachmentType {
  id: number;
  fileName: string;
}

export interface JobPostingDetailType extends JobPostingType {
  positions: JobPositionType[];
  attachments: AttachmentType[];
}

export const employmentTypeMeta: Record<EmploymentType, { label: string }> = {
  FULL_TIME: { label: '정규직' },
  CONTRACT: { label: '계약직' },
  INTERN: { label: '인턴' },
  INDUSTRIAL_FUNCTIONAL_PERSONNEL: { label: '산업기능요원' },
};
