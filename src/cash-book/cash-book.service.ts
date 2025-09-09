import { Injectable } from '@nestjs/common';
import { CreateCashBookDto } from './dto/create-cash-book.dto';
import { UpdateOrderBookDto } from './dto/update-cash-book.dto';
import { CashBookStatus, Prisma, UserRole } from '@prisma/client';
import { CashBookRepository } from './repositories/cash-book.repository';
import { ErrorService } from '../common/error/error.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { v4 as uuid } from 'uuid';
import { GetCashBooksQueryDto } from './dto/get-cash-book.dto';

@Injectable()
export class CashBookService {
  constructor(
    private cashBookRepo: CashBookRepository,
    private errorService: ErrorService,
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

    const cashBooks = await this.cashBookRepo.getCashBooks(
      this.cashBookSelectOptions,
      {
        ownerId,
        // createdId: auth.role !== UserRole.OWNER ? auth.id : undefined,
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

    return cashBooks.map((cashBook) => this.toCashBookResponse(cashBook));
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
        cloedRole: auth.role,
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
    cloedRole: true,
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
}
