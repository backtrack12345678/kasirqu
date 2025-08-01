import { UserRole } from '@prisma/client';
export interface IOneUser {
  id: string;
  nama: string;
}

export interface IUser extends IOneUser {
  phone: string;
  role: UserRole;
  isActive: boolean;
}

export interface IKota_Kab {
  id: number;
  nama: string;
}

export interface IUserResult extends IUser {
  kota_kab: IKota_Kab;
}

export interface IUserResponse extends IUser {
  kotaKab: IKota_Kab;
}
