export interface RecommendedJobType {
  id: number;
  companyName: string;
  dDay: number;
}

export interface StudentDashboardType {
  openJobs: number;
  myApplications: number;
  passed: number;
  recommendedJobs: RecommendedJobType[];
}
