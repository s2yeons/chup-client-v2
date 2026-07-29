export const authUrl = {
  getDatagsmLogin: (redirectOrigin: string) =>
    `/api/auth/datagsm/login?redirectOrigin=${encodeURIComponent(redirectOrigin)}`,
  postLogout: () => '/api/auth/logout',
} as const;
