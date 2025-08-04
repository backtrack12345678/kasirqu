import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';
import { OtpService } from '../otp/otp.service';
import { v4 as uuid } from 'uuid';
import { IAuth } from '../auth/interfaces/auth.interface';
import { USER_TYPES } from './enum/user.enum';
import {
  IOneUser,
  IUserResponse,
  IUserResult,
} from './interfaces/user.interface';
import { RedisService } from '../common/redis/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private errorService: ErrorService,
    private otpService: OtpService,
    private redisService: RedisService,
  ) {}

  async create(payload: CreateUserDto): Promise<{ id: string }> {
    const { token, ...userData } = payload;

    await this.otpService.verifyTempToken(userData.phone, token);
    await this.verifyUnregisteredUser(userData.phone);
    await this.checkKotaKabupatenExists(userData.kotaKabId);

    const user = await this.prismaService.user.create({
      data: {
        id: `user-${uuid().toString()}`,
        ...userData,
      },
      select: this.userSelectCondition(USER_TYPES.PRIVATE),
    });

    await this.redisService.set(
      `user/profile:${user.id}`,
      JSON.stringify(user),
      900,
    );

    return { id: user.id };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findUserProfile(auth: IAuth): Promise<IUserResponse> {
    const userCached = await this.redisService.get(`user/profile:${auth.id}`);

    if (userCached) {
      if (userCached === '__NOT_FOUND__') {
        this.errorService.notFound('Pengguna Tidak Ditemukan');
      }
      return this.toUserResponse(JSON.parse(userCached));
    }

    const user: IUserResult = await this.prismaService.user.findUnique({
      where: {
        id: auth.id,
      },
      select: this.userSelectCondition(USER_TYPES.PRIVATE),
    });

    if (!user) {
      // negative caching
      this.redisService.set(`user/profile:${auth.id}`, '__NOT_FOUND__', 900);
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    await this.redisService.set(
      `user/profile:${auth.id}`,
      JSON.stringify(user),
      900,
    );

    return this.toUserResponse(user);
  }

  async findOne(userId: string): Promise<IOneUser> {
    const userCached = await this.redisService.get(`user/find-one:${userId}`);

    if (userCached) {
      if (userCached === '__NOT_FOUND__') {
        this.errorService.notFound('Pengguna Tidak Ditemukan');
      }
      return JSON.parse(userCached);
    }

    const user: IOneUser = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: this.userSelectCondition(USER_TYPES.PUBLIC),
    });

    if (!user) {
      // negative caching
      this.redisService.set(`user/find-one:${userId}`, '__NOT_FOUND__', 900);
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    await this.redisService.set(
      `user/find-one:${userId}`,
      JSON.stringify(user),
      900,
    );

    return user;
  }

  async update(auth: IAuth, payload: UpdateUserDto): Promise<IUserResponse> {
    if (payload.kotaKabId)
      await this.checkKotaKabupatenExists(payload.kotaKabId);

    const user = await this.prismaService.user.update({
      where: {
        id: auth.id,
      },
      data: payload,
      select: this.userSelectCondition(USER_TYPES.PRIVATE),
    });

    const userPublic = {
      id: user.id,
      nama: user.nama,
    };

    try {
      await this.redisService.set(
        `user/profile:${auth.id}`,
        JSON.stringify(user),
        900,
      );
      await this.redisService.set(
        `user/find-one:${auth.id}`,
        JSON.stringify(userPublic),
        900,
      );
    } catch (error) {
      await this.redisService.delete(`user/profile:${auth.id}`);
      await this.redisService.delete(`user/find-one:${auth.id}`);
    }

    return this.toUserResponse(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // async verifyRegisteredUser(phone: string) {
  //   const countPhone = await this pris
  // }

  async verifyUnregisteredUser(phone: string): Promise<void> {
    const countPhone = await this.prismaService.user.count({
      where: {
        phone: phone,
      },
    });

    if (countPhone !== 0) {
      this.errorService.badRequest('Pengguna Sudah Terdaftar');
    }
  }

  async verifyRegisteredUser(phone: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        phone: phone,
      },
      select: {
        id: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    if (!user.isActive) {
      this.errorService.badRequest('Pengguna Sedang Ditangguhkan');
    }

    return user;
  }

  async checkKotaKabupatenExists(id: number): Promise<void> {
    const countKotaKab = await this.prismaService.kota_Kabupaten.count({
      where: {
        id: id,
      },
    });

    if (countKotaKab === 0) {
      this.errorService.notFound('Kota Atau Kabupaten Tidak Ditemukan');
    }
  }

  private userSelectCondition(type: USER_TYPES) {
    return {
      id: true,
      nama: true,
      ...(type === USER_TYPES.PRIVATE && {
        phone: true,
        role: true,
        kota_kab: {
          select: {
            id: true,
            nama: true,
          },
        },
        isActive: true,
      }),
    };
  }

  private toUserResponse(user: IUserResult): IUserResponse {
    const { kota_kab, ...userData } = user;
    return {
      ...userData,
      kotaKab: {
        id: kota_kab.id,
        nama: kota_kab.nama,
      },
    };
  }

  private async getUserDataFromRedis<T>(key: string): Promise<T | null> {
    try {
      const cached = await this.redisService.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null; // fallback ke database jika cache error
    }
  }
}
