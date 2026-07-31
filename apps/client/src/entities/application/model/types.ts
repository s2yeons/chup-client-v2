export type ApplicationStatusType = 'APPLIED' | 'PASSED' | 'FAILED';

export interface ApplicationType {
  id: number;
  jobPosting: {
    id: number;
    companyName: string;
  } | null;
  jobPosition: {
    id: number;
    name: string;
  } | null;
  status: ApplicationStatusType;
  appliedAt: string;
  resultUpdatedAt: string | null;
}

export interface PostApplicationReqType {
  jobId: number;
  jobPositionId: number;
  resumeId: number;
}
