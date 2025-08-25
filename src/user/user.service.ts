import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../common/prisma/prisma.service';
import { ErrorService } from '../common/error/error.service';
import { OtpService } from '../otp/otp.service';
import { v4 as uuid } from 'uuid';
import { IAuth } from '../auth/interfaces/auth.interface';
import {
  IOneUser,
  IUserResponse,
  IUserResult,
} from './interfaces/user.interface';
import { RedisService } from '../common/redis/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private errorService: ErrorService,
    private otpService: OtpService,
    private redisService: RedisService,
    private userRepo: UserRepository,
  ) {}

  async create(payload: CreateUserDto): Promise<{ id: string }> {
    const { token, ...userData } = payload;

    await this.otpService.verifyTempToken(userData.phone, token);
    await this.verifyUnregisteredUser(userData.phone);
    await this.checkKotaKabupatenExists(userData.kotaKabId);

    const user = await this.userRepo.createUser(
      {
        id: `user-${uuid().toString()}`,
        ...userData,
      },
      this.userSelectCondition,
    );

    await this.redisService.set(`user:${user.id}`, JSON.stringify(user), 900);

    return { id: user.id };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findUserProfile(auth: IAuth): Promise<IUserResponse> {
    const userCached = await this.redisService.get(`user:${auth.id}`);

    if (userCached) {
      if (userCached === '__NOT_FOUND__') {
        this.errorService.notFound('Pengguna Tidak Ditemukan');
      }
      return this.toUserResponse(JSON.parse(userCached));
    }

    const user: IUserResult = await this.userRepo.getUserById(
      auth.id,
      this.userSelectCondition,
    );

    if (!user) {
      // negative caching
      this.redisService.set(`user:${auth.id}`, '__NOT_FOUND__', 900);
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    await this.redisService.set(`user:${auth.id}`, JSON.stringify(user), 900);

    return this.toUserResponse(user);
  }

  async findOne(userId: string): Promise<IOneUser> {
    const userCached = await this.redisService.get(`user/:${userId}`);

    if (userCached) {
      if (userCached === '__NOT_FOUND__') {
        this.errorService.notFound('Pengguna Tidak Ditemukan');
      }

      const user = JSON.parse(userCached);
      return this.toUserPublicResponse(user);
    }

    const user: IUserResult = await this.userRepo.getUserById(
      userId,
      this.userSelectCondition,
    );

    if (!user) {
      // negative caching
      this.redisService.set(`user:${userId}`, '__NOT_FOUND__', 900);
      this.errorService.notFound('Pengguna Tidak Ditemukan');
    }

    await this.redisService.set(`user:${userId}`, JSON.stringify(user), 900);

    return this.toUserPublicResponse(user);
  }

  async update(auth: IAuth, payload: UpdateUserDto): Promise<IUserResponse> {
    if (payload.kotaKabId)
      await this.checkKotaKabupatenExists(payload.kotaKabId);

    const user = await this.userRepo.updateUserById(
      auth.id,
      payload,
      this.userSelectCondition,
    );

    try {
      await this.redisService.set(`user/${auth.id}`, JSON.stringify(user), 900);
    } catch (error) {
      await this.redisService.delete(`user/${auth.id}`);
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
    const countPhone = await this.userRepo.countUserByPhone(phone);

    if (countPhone !== 0) {
      this.errorService.badRequest('Pengguna Sudah Terdaftar');
    }
  }

  async verifyRegisteredUser(phone: string) {
    const user = await this.userRepo.getUserByphone(phone, {
      id: true,
      role: true,
      isActive: true,
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

  private userSelectCondition = {
    id: true,
    nama: true,
    phone: true,
    role: true,
    kota_kab: {
      select: {
        id: true,
        nama: true,
      },
    },
    isActive: true,
  };

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

  private toUserPublicResponse(user: IUserResult) {
    return {
      id: user.id,
      nama: user.nama,
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
