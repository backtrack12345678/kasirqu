import { Injectable } from '@nestjs/common';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { IAuth } from '../auth/interfaces/auth.interface';
import { UserRole } from '@prisma/client';
import { ChargeRepository } from './repositories/charge.repository';
import { ErrorService } from '../common/error/error.service';

@Injectable()
export class ChargeService {
  constructor(
    private chargeRepo: ChargeRepository,
    private errorService: ErrorService,
  ) {}

  async create(auth: IAuth, payload: CreateChargeDto) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const charge = await this.chargeRepo.createCharge({ ownerId, ...payload });

    return this.toChargeResponse(charge);
  }

  async findAll(auth: IAuth) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const charges = await this.chargeRepo.getChargeByOwnerId(ownerId);

    return charges.map((charge) => this.toChargeResponse(charge));
  }

  async findOne(auth: IAuth, id: number) {
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const charge = await this.chargeRepo.getChargeById(id);

    if (!charge || charge.owner.id !== ownerId) {
      this.errorService.notFound('Biaya Tidak Ditemukan');
    }

    return this.toChargeResponse(charge);
  }

  async update(auth: IAuth, id: number, payload: UpdateChargeDto) {
    await this.findOne(auth, id);

    const charge = await this.chargeRepo.updateChargeById(id, payload);

    return this.toChargeResponse(charge);
  }

  async remove(auth: IAuth, id: number) {
    await this.findOne(auth, id);

    await this.chargeRepo.deleteChargeById(id, {
      id: true,
    });
  }

  toChargeResponse(charge) {
    const { tax, ...dataCharge } = charge;
    return {
      ...dataCharge,
      tax: Number(tax),
    };
  }
}
