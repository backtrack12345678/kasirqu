import { Injectable } from '@nestjs/common';
import { CreateCashBookDto } from './dto/create-cash-book.dto';
import { UpdateOrderBookDto } from './dto/update-cash-book.dto';
import { CashBookStatus, Prisma, UserRole } from '@prisma/client';
import { CashBookRepository } from './repositories/cash-book.repository';
import { ErrorService } from '../common/error/error.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { v4 as uuid } from 'uuid';
import { GetCashBooksQueryDto } from './dto/get-cash-book.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import Decimal from 'decimal.js';

@Injectable()
export class CashBookService {
  constructor(
    private cashBookRepo: CashBookRepository,
    private errorService: ErrorService,
    private prismaService: PrismaService,
  ) {}

  async create(auth: IAuth, payload: CreateCashBookDto) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    //1. cek dulu kas sebelumnya udah ditutup apa belum
    const previousBook = await this.findOneByOwnerIdAndStatus(
      ownerId,
      CashBookStatus.BUKA,
    );

    if (previousBook) {
      this.errorService.badRequest(
        'Tutup Dulu Buku Kas Sebelumnya, Sebelum Membuat Yang Baru',
      );
    }

    //2. Kemudian Buat Buku Kas
    const cashBook = await this.cashBookRepo.createBook(
      {
        id: `kas-${uuid().toString()}`,
        ownerId,
        saldoTunai: Prisma.Decimal(payload.saldoTunai),
        createdId: auth.id,
        createdName: auth.nama,
        createdRole: auth.role,
      },
      this.cashBookSelectOptions,
    );

    return this.toCashBookResponse(cashBook);
  }

  async findAll(auth: IAuth, query: GetCashBooksQueryDto) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const { startDate, endDate } = this.getDateRange(query.month);

    const cashBooks = await this.cashBookRepo.getCashBooks(
      this.cashBookSelectOptions,
      {
        ownerId,
        ...(auth.role === UserRole.CASHIER && { createdId: auth.id }),
        createdAt: { gte: startDate, lte: endDate },
      },
      {
        take: query.size,
        ...(query.cursor && {
          skip: 1,
          cursor: {
            id: query.cursor,
          },
        }),
        orderBy: {
          createdAt: 'desc', // 🔹 urutkan dari terbaru ke terlama
        },
      },
    );

    const baseWhere = {
      book: {
        ownerId,
        ...(auth.role === UserRole.CASHIER && { createdId: auth.id }),
      },
      createdAt: { gte: startDate, lte: endDate },
    };

    const [orders, costs] = await Promise.all([
      this.prismaService.order.groupBy({
        by: ['cashBookId'],
        _sum: { totalHarga: true },
        where: baseWhere,
      }),
      this.prismaService.cost.groupBy({
        by: ['cashBookId'],
        _sum: { totalHarga: true },
        where: baseWhere,
      }),
    ]);

    return cashBooks.map((cashBook) => {
      const order = orders.find((o) => o.cashBookId === cashBook.id);
      const cost = costs.find((c) => c.cashBookId === cashBook.id);

      const totalOrder = new Decimal(order?._sum.totalHarga || 0);
      const totalCost = new Decimal(cost?._sum.totalHarga || 0);

      const profitValue = totalOrder.minus(totalCost);
      const profitStatus = profitValue.gte(0) ? 'UNTUNG' : 'RUGI';

      return {
        ...this.toCashBookResponse(cashBook),
        totalOrder: totalOrder.toString(),
        totalCost: totalCost.toString(),
        profit: {
          value: profitValue.toString(),
          status: profitStatus,
        },
      };
    });
  }

  async findOne(auth: IAuth, id: string) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const cashBook = await this.cashBookRepo.getCashBookById(
      id,
      this.cashBookSelectOptions,
    );

    if (!cashBook || cashBook.owner.id !== ownerId) {
      this.errorService.notFound('Buku Kas Tidak Ditemukan');
    }

    if (auth.role === UserRole.CASHIER && auth.id !== cashBook.createdId) {
      this.errorService.forbidden(
        'Tidak Dapat Melihat Buku Kas Milik Kasir Lain',
      );
    }

    return this.toCashBookResponse(cashBook);
  }

  async findOneByOwnerIdAndStatus(ownerId: string, status: CashBookStatus) {
    return this.cashBookRepo.getBookByOwnerIdAndStatus(ownerId, status, {
      id: true,
    });
  }

  async update(id: number, updateOrderBookDto: UpdateOrderBookDto) {}

  remove(id: number) {
    return `This action removes a #${id} orderBook`;
  }

  async close(auth: IAuth, id: string) {
    const cashBook = await this.findOne(auth, id);

    const closedCashBook = await this.cashBookRepo.updateCashBookById(
      cashBook.id,
      {
        status: CashBookStatus.TUTUP,
        closedId: auth.id,
        closedName: auth.nama,
        closedRole: auth.role,
      },
      this.cashBookSelectOptions,
    );

    return this.toCashBookResponse(closedCashBook);
  }

  cashBookSelectOptions = {
    id: true,
    saldoTunai: true,
    status: true,
    owner: {
      select: {
        id: true,
        nama: true,
      },
    },
    createdId: true,
    createdName: true,
    createdRole: true,
    closedId: true,
    closedName: true,
    closedRole: true,
    createdAt: true,
    updatedAt: true,
  };

  toCashBookResponse(cashBook) {
    const {
      saldoTunai,
      createdId,
      createdName,
      createdRole,
      closedId,
      closedName,
      closedRole,
      ...cashBookData
    } = cashBook;
    return {
      saldoTunai: saldoTunai.toString(),
      ...cashBookData,
      createdBy: {
        id: createdId,
        nama: createdName,
        role: createdRole,
      },
      closedBy: {
        id: closedId,
        nama: closedName,
        role: closedRole,
      },
    };
  }

  private getDateRange(month: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1, 0, 0, 0);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59);
    return { startDate, endDate };
  }
}
