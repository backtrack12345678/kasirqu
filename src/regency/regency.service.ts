import { Injectable } from '@nestjs/common';
import { CreateRegencyDto } from './dto/create-regency.dto';
import { UpdateRegencyDto } from './dto/update-regency.dto';
import { RegencyRepository } from './repositories/regency.repository';
import { GetAllQueryDto } from './dto/get-regency.dto';
import { IRegencyResponse } from './interfaces/regency.interface';

@Injectable()
export class RegencyService {
  constructor(private regencyRepo: RegencyRepository) {}

  create(createRegencyDto: CreateRegencyDto) {
    return 'This action adds a new regency';
  }

  async findAll(query?: GetAllQueryDto): Promise<IRegencyResponse[]> {
    const regencies = await this.regencyRepo.getRegencies(
      {
        id: true,
        nama: true,
      },
      {
        nama: {
          contains: query.nama,
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

    return regencies;
  }

  findOne(id: number) {
    return `This action returns a #${id} regency`;
  }

  update(id: number, updateRegencyDto: UpdateRegencyDto) {
    return `This action updates a #${id} regency`;
  }

  remove(id: number) {
    return `This action removes a #${id} regency`;
  }
}
