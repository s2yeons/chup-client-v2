export type EmploymentType =
  'FULL_TIME' | 'CONTRACT' | 'INTERN' | 'INDUSTRIAL_FUNCTIONAL_PERSONNEL';

export type JobStatusType = 'RECRUITING' | 'CLOSED';

export interface GetAdminJobsParamsType {
  q?: string;
}

export interface AdminDashboardType {
  openJobs: number;
  totalApplicants: number;
  pending: number;
  passed: number;
}

export interface AdminJobPostingType {
  id: number;
  companyName: string;
  description: string;
  employmentType: EmploymentType;
  recruitStart: string;
  recruitEnd: string;
  status: JobStatusType;
  createdAt: string;
}

export interface AdminJobPostingDetailType extends AdminJobPostingType {
  positions: { id: number; name: string }[];
  attachments: { id: number; fileName: string }[];
}

export const employmentTypeMeta: Record<EmploymentType, { label: string }> = {
  FULL_TIME: { label: '정규직' },
  CONTRACT: { label: '계약직' },
  INTERN: { label: '인턴' },
  INDUSTRIAL_FUNCTIONAL_PERSONNEL: { label: '산업기능요원' },
};
