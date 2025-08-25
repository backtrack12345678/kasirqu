import { Prisma } from '@prisma/client';

export interface IRegencyResponse {
  id: number;
  nama: string;
}

export interface IGetRegenciesOtherOptions {
  take?: number;
  cursor?: Prisma.Kota_KabupatenWhereUniqueInput;
  skip?: number;
  orderBy?:
    | Prisma.Kota_KabupatenOrderByWithRelationInput
    | Prisma.Kota_KabupatenOrderByWithRelationInput[];
}
