export type JobStatusType = '모집중' | '마감';

export type ApplicationStatusType = '지원 완료' | '서류 합격' | '서류 불합격';

export interface JobType {
  id: number;
  company: string;
  description: string;
  positions: string[];
  employment: string;
  deadline: string;
  dday: number;
  featured?: boolean;
  applicants: number;
  status: JobStatusType;
}

export interface ApplicationType {
  id: number;
  name: string;
  studentId: string;
  company: string;
  position: string;
  date: string;
  email: string;
  phone: string;
  status: ApplicationStatusType;
}
