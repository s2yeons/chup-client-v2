export type ApplicationStatusType = 'APPLIED' | 'PASSED' | 'FAILED';

export interface ApplicationType {
  id: number;
  name: string;
  studentId: string | null;
  email: string;
  phoneNumber: string | null;
  companyName: string;
  positionName: string;
  status: ApplicationStatusType;
  appliedAt: string;
}

export interface GetApplicantsParamsType {
  jobPostingId?: number;
}

export interface PatchApplicantResultReqType {
  status: ApplicationStatusType;
}
