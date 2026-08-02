export type ApplicationStatusType = 'APPLIED' | 'PASSED' | 'FAILED';

export interface ApplicationType {
  id: number;
  companyName: string;
  positionName: string;
  status: ApplicationStatusType;
  appliedAt: string;
}

export interface PostApplicationReqType {
  jobId: number;
  jobPositionId: number;
  resumeIds: number[];
}
