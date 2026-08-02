export type UserRoleType = 'STUDENT' | 'ADMIN';

export interface UserType {
  id: number;
  role: UserRoleType;
  studentId: string | null;
  name: string;
  email: string;
  phoneNumber: string | null;
  approved: boolean;
  version: number;
  createdAt: string;
}
