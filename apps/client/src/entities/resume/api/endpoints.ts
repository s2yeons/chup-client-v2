export const resumeUrl = {
  getResumes: () => '/api/users/me/resumes',
  postResume: () => '/api/users/me/resumes',
  deleteResume: (resumeId: number) => `/api/users/me/resumes/${resumeId}`,
} as const;
