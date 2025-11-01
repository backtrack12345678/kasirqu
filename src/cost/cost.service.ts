import { Injectable } from '@nestjs/common';
import { CreateCostDto } from './dto/create-cost.dto';
import { UpdateCostDto } from './dto/update-cost.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { CashBookStatus, Prisma, UserRole } from '@prisma/client';
import { ErrorService } from '../common/error/error.service';
import { CashBookService } from '../cash-book/cash-book.service';
import { v4 as uuid } from 'uuid';
import { CostRepository } from './repositories/cost.repository';
import { GetCostQueryDto } from './dto/get- cost.dto';

@Injectable()
export class CostService {
  constructor(
    private errorService: ErrorService,
    private cashBookService: CashBookService,
    private costRepo: CostRepository,
  ) {}

  async create(auth: IAuth, payload: CreateCostDto) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const cashBook = await this.cashBookService.findOneByOwnerIdAndStatus(
      ownerId,
      CashBookStatus.BUKA,
    );

    if (!cashBook) {
      this.errorService.badRequest(
        'Buku Kas Tidak Ada, Silahkan Buat Terlebih Dahulu',
      );
    }

    const totalHarga = payload.items.reduce((acc, p) => {
      return acc.add(new Prisma.Decimal(p.harga).mul(p.jumlah));
    }, new Prisma.Decimal(0));

    const id = `cost-${uuid().toString()}`;

    const cost = await this.costRepo.createCost({
      id,
      totalHarga,
      items: {
        createMany: {
          data: payload.items.map((item) => {
            const { harga, ...dataItem } = item;
            return {
              ...dataItem,
              harga: new Prisma.Decimal(harga),
            };
          }),
        },
      },
      book: { connect: { id: cashBook.id } },
    });

    return this.toCostResponse(cost);
  }

  async findAll(auth: IAuth, query?: GetCostQueryDto) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const costs = await this.costRepo.getCosts(
      {
        book: {
          ownerId,
          id: query.bookId || undefined,
        },
      },
      {
        take: query.size,
        ...(query.cursor && {
          skip: 1,
          cursor: {
            id: query.cursor,
          },
        }),
      },
    );

    return costs.map((cost) => this.toCostResponse(cost));
  }

  async findOne(auth: IAuth, id: string) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const cost = await this.costRepo.getCostById(id);

    if (!cost || cost.book.ownerId !== ownerId) {
      this.errorService.notFound('Biaya Tidak Ditemukan');
    }

    return this.toCostResponse(cost);
  }

  update(id: number, updateCostDto: UpdateCostDto) {
    return `This action updates a #${id} cost`;
  }

  remove(id: number) {
    return `This action removes a #${id} cost`;
  }

  toCostResponse(cost) {
    const { totalHarga, items, ...costData } = cost;

    return {
      ...costData,
      totalHarga: totalHarga.toString(),
      items: items.map((item) => this.toCostItemsResponse(item)),
    };
  }

  toCostItemsResponse(item) {
    const { harga, ...itemData } = item;
    return {
      ...itemData,
      harga: harga.toString(),
    };
  }
}
