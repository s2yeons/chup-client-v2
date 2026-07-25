'use client';

import { createContext, useContext, useState } from 'react';

import { initialApplications, initialJobs } from './mock-data';
import type { ApplicationType, JobType } from './types';

interface RecruitmentContextType {
  jobs: JobType[];
  applications: ApplicationType[];
  setJobs: React.Dispatch<React.SetStateAction<JobType[]>>;
  setApplications: React.Dispatch<React.SetStateAction<ApplicationType[]>>;
}

const RecruitmentContext = createContext<RecruitmentContextType | null>(null);

interface RecruitmentProviderProps {
  children: React.ReactNode;
}

const RecruitmentProvider = ({ children }: RecruitmentProviderProps) => {
  const [jobs, setJobs] = useState<JobType[]>(initialJobs);
  const [applications, setApplications] = useState<ApplicationType[]>(initialApplications);

  return (
    <RecruitmentContext.Provider value={{ jobs, applications, setJobs, setApplications }}>
      {children}
    </RecruitmentContext.Provider>
  );
};

export const useRecruitment = () => {
  const recruitment = useContext(RecruitmentContext);

  if (!recruitment) {
    throw new Error('RecruitmentProvider 내부에서 사용해야 합니다.');
  }

  return recruitment;
};

export default RecruitmentProvider;
