import { UserRole } from '@prisma/client';

export interface IAuth {
  id: string;
  nama?: string;
  role?: UserRole;
  ownerId?: string;
}

export interface ILogin {
  accessToken: string;
  refreshToken?: string;
}
