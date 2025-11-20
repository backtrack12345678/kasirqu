import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import { QrisRepository } from './repositories/qris.repository';
import { IAuth } from '../auth/interfaces/auth.interface';
import { Request } from 'express';
import { UserRole } from '@prisma/client';
import { ErrorService } from '../common/error/error.service';

@Injectable()
export class QrisService {
  constructor(
    private fileService: FileService,
    private qrisRepo: QrisRepository,
    private errorService: ErrorService,
  ) {}

  async create(request: any, media: Express.Multer.File) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const uploadedMedia = await this.fileService.writeFileStream(media, 'qris');

    const qris = await this.qrisRepo.createQris({
      owner: { connect: { id: ownerId } },
      namaFile: uploadedMedia.fileName,
      path: uploadedMedia.filePath,
    });

    return this.toQrisResponse(qris, request);
  }

  async findAll(request: any) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const qriss = await this.qrisRepo.getQriss({
      ownerId,
    });

    return qriss.map((qris) => this.toQrisResponse(qris, request));
  }

  async findOne(request: any, id: number, isPath: boolean = false) {
    const auth: IAuth = request.user;
    const ownerId = auth.role !== UserRole.OWNER ? auth.ownerId : auth.id;

    const qris = await this.qrisRepo.getQrisById(id);

    if (!qris || qris.owner.id !== ownerId) {
      this.errorService.notFound('QRIS Tidak Ditemukan');
    }

    return this.toQrisResponse(qris, request, isPath);
  }

  async update(request: any, id: number, media: Express.Multer.File) {
    const qris = await this.findOne(request, id, true);

    const uploadedMedia = media
      ? await this.fileService.writeFileStream(media, 'qris')
      : null;

    const updatedQris = await this.qrisRepo.updateQrisById(id, {
      namaFile: uploadedMedia?.fileName,
      path: uploadedMedia?.filePath,
    });

    if (uploadedMedia) {
      console.log(qris);

      await this.fileService.deleteFile(qris.path);
    }

    return this.toQrisResponse(updatedQris, request);
  }

  async remove(request: any, id: number) {
    await this.findOne(request, id);

    const qris = await this.qrisRepo.deleteQrisById(id, {
      path: true,
    });

    // delete file
    this.fileService.deleteFile(qris.path);
  }

  toQrisResponse(qris, request: Request, isPath: boolean = false) {
    const { namaFile, path, ...qrisData } = qris;
    return {
      ...qrisData,
      urlFile: `${this.fileService.getHostFile(request)}/file/qris/${namaFile}`,
      path: isPath ? path : undefined,
    };
  }
}
