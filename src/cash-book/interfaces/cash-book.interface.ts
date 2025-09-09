import { Prisma } from '@prisma/client';

export interface CashBook {}

export interface IGetCashBookOtherOptions {
  take?: number;
  cursor?: Prisma.CashBookWhereUniqueInput;
  skip?: number;
  orderBy?:
    | Prisma.CashBookOrderByWithRelationInput
    | Prisma.CashBookOrderByWithRelationInput[];
}
