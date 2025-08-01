import { UserRole } from '@prisma/client';

export interface IAuth {
  id: string;
  role?: UserRole;
}

export interface ILogin {
  accessToken: string;
  refreshToken?: string;
}
