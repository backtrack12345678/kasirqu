import { Prisma } from '@prisma/client';

export interface Order {}

export interface IGetOrderOtherOptions {
  take?: number;
  cursor?: Prisma.OrderWhereUniqueInput;
  skip?: number;
  orderBy?:
    | Prisma.OrderOrderByWithRelationInput
    | Prisma.OrderOrderByWithRelationInput[];
}
