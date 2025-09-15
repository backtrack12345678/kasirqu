import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentOrderDto, UpdateOrderDto } from './dto/update-order.dto';
import { CashBookService } from '../cash-book/cash-book.service';
import { IAuth } from '../auth/interfaces/auth.interface';
import { CashBookStatus, OrderStatus, Prisma, UserRole } from '@prisma/client';
import { OrderRepository } from './repositories/order.repository';
import { ErrorService } from '../common/error/error.service';
import { v4 as uuid } from 'uuid';
import { ProductService } from '../product/product.service';
import { UserService } from '../user/user.service';
import Decimal from 'decimal.js';
import { GetOrdersQueryDto, GetTotalOrdersQueryDto } from './dto/get-order.dto';

@Injectable()
export class OrderService {
  constructor(
    private cashBookService: CashBookService,
    private orderRepo: OrderRepository,
    private errorService: ErrorService,
    private productService: ProductService,
    private userService: UserService,
  ) {}

  async create(auth: IAuth, payload: CreateOrderDto) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;
    const { products, ...orderPayload } = payload;

    const ids = products.map((p) => p.id);

    if (new Set(ids).size !== ids.length) {
      this.errorService.badRequest('id product ada yang duplikat');
    }

    const dbProducts = await this.productService.findAllByIds(ids, ownerId);

    if (dbProducts.length !== ids.length) {
      this.errorService.badRequest(
        'Beberapa Produk tidak ditemukan atau milik pengguna lain',
      );
    }

    const cashBook = await this.cashBookService.findOneByOwnerIdAndStatus(
      ownerId,
      CashBookStatus.BUKA,
    );

    if (!cashBook) {
      this.errorService.badRequest(
        'Buku Kas Tidak Ada, Silahkan Buat Terlebih Dahulu',
      );
    }

    const totalHarga = payload.products.reduce((acc, p) => {
      const product = dbProducts.find((d) => d.id === p.id);
      if (!product) return acc;
      return acc.add(product.harga.mul(p.quantity));
    }, new Prisma.Decimal(0));

    const id = `order-${uuid().toString()}`;

    const order = await this.orderRepo.createOrder(
      {
        id,
        ...orderPayload,
        createdBy: {
          connect: {
            id: auth.id,
          },
        },
        createdName: auth.nama,
        createdRole: auth.role,
        totalHarga,
        products: {
          createMany: {
            data: payload.products.map((p) => {
              const product = dbProducts.find((d) => d.id === p.id)!;
              return {
                nama: product.nama,
                harga: product.harga,
                jumlah: p.quantity,
              };
            }),
          },
        },
        book: { connect: { id: cashBook.id } },
      },
      this.toOrderSelectOptions,
    );

    return this.toOrderResponse(order);
  }

  async findAll(auth: IAuth, query: GetOrdersQueryDto) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const orders = await this.orderRepo.getOrders(
      this.toOrderSelectOptions,
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

    return orders.map((order) => this.toOrderResponse(order));
  }

  async findOne(auth: IAuth, id: string) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const order = await this.orderRepo.getOrderById(id, {
      ...this.toOrderSelectOptions,
      book: {
        select: {
          ownerId: true,
        },
      },
    });

    if (!order || order.book.ownerId !== ownerId) {
      this.errorService.notFound('Pesanan Tidak Ditemukan');
    }

    if (auth.role === UserRole.WAITER && auth.id !== order.createdId) {
      this.errorService.forbidden(
        'Tidak bisa melihat pesanan yang dibuat waiter lain',
      );
    }

    return this.toOrderResponse(order);
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  async remove(auth: IAuth, id: string) {
    const order = await this.findOne(auth, id);

    if ([OrderStatus.DITERIMA, OrderStatus.DIBAYAR].includes(order.status)) {
      this.errorService.badRequest(
        `Pesanan Sudah ${order.status} Tidak Bisa Diapus`,
      );
    }

    await this.orderRepo.deleteOrderById(id, {
      id: true,
    });
  }

  async payment(auth: IAuth, id: string, payload: PaymentOrderDto) {
    const order = await this.findOne(auth, id);

    if ([OrderStatus.DIBAYAR].includes(order.status)) {
      this.errorService.badRequest(`Pesanan Sudah ${order.status}`);
    }

    const totalPaid = new Decimal(payload.totalPaid);
    const totalPrice = new Decimal(order.totalPrice);

    if (totalPaid.lt(totalPrice)) {
      this.errorService.badRequest(
        'Uang Yang Dibayarkan Kurang Dari Total Harga',
      );
    }

    const change = totalPaid.minus(totalPrice).toString();

    const orderPayment = await this.orderRepo.updateOrderById(
      id,
      {
        payments: {
          create: {
            jumlah: Prisma.Decimal(totalPrice),
            receivedId: auth.id,
            receivedName: auth.nama,
            receivedRole: auth.role,
          },
        },
      },
      this.toOrderSelectOptions,
    );

    return {
      ...this.toOrderResponse(orderPayment),
      totalBayar: totalPaid.toString(),
      kembalian: change,
    };
  }

  async totalPaid(auth: IAuth, query: GetTotalOrdersQueryDto): Promise<string> {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const now = new Date();
    const { start, end } = this.getRange(query.type, now);

    const total = await this.orderRepo.sumOrder({
      book: {
        ownerId: ownerId,
      },
      status: OrderStatus.DIBAYAR,
      createdAt: { gte: start, lte: end },
    });

    return total._sum.totalHarga.toString();
  }

  private getRange(type: 'day' | 'month', now: Date) {
    const start = new Date(now);
    const end = new Date(now);

    if (type === 'day') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
    }

    return { start, end };
  }

  toOrderPaymentSelectOptions = {
    id: true,
    metode: true,
    jumlah: true,
    receivedId: true,
    receivedName: true,
    receivedRole: true,
    createdAt: true,
    updatedAt: true,
  };

  toOrderSelectOptions = {
    id: true,
    customer: true,
    status: true,
    totalHarga: true,
    createdId: true,
    createdName: true,
    createdRole: true,
    createdAt: true,
    updatedAt: true,
    payments: {
      select: this.toOrderPaymentSelectOptions,
    },
  };

  toOrderResponse(order) {
    const { payments, totalHarga, ...orderData } = order;
    return {
      ...orderData,
      totalHarga: totalHarga.toString(),
      payments: payments.map((payment) => this.toOrderPaymentResponse(payment)),
    };
  }

  toOrderPaymentResponse(payment) {
    const { jumlah, ...paymentData } = payment;
    return {
      ...paymentData,
      jumlah: jumlah.toString(),
    };
  }
}
