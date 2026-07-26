export type ApplicationStatusType = 'APPLIED' | 'PASSED' | 'FAILED';

export interface ApplicationType {
  id: number;
  jobPosting: {
    id: number;
    companyName: string;
  };
  jobPosition: {
    id: number;
    name: string;
  };
  status: ApplicationStatusType;
  appliedAt: string;
  resultUpdatedAt: string | null;
}
