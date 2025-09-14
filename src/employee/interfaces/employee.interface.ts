import { UserRole } from '@prisma/client';

export interface IEmployeeResponse {
  id: string;
  email: string;
  password?: string;
  nama: string;
  role: UserRole;
  isActive: boolean;
  ownerId: string;
}
