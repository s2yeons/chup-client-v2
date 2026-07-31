export type ApplicationStatusType = 'APPLIED' | 'PASSED' | 'FAILED';

export interface ApplicationType {
  id: number;
  user: {
    id: number;
    name: string;
    studentId: string | null;
    email: string;
    phoneNumber: string | null;
  };
  jobPosting: {
    id: number;
    companyName: string;
  } | null;
  jobPosition: {
    id: number;
    name: string;
  };
  status: ApplicationStatusType;
  appliedAt: string;
  resultUpdatedAt: string | null;
}

export interface GetApplicantsParamsType {
  jobPostingId?: number;
}

export interface PatchApplicantResultReqType {
  status: ApplicationStatusType;
}
