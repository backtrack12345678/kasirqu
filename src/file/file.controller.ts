import { Controller, Get, Param, Res } from '@nestjs/common';
import { FileService } from './file.service';
import { Auth } from '../auth/decorator/auth.decorator';
import { Response } from 'express';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('/:folder/:filename')
  async getFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Res() response: Response,
  ) {
    const { fileStream, mime } = await this.fileService.readFileStream(
      filename,
      folder,
    );
    response.setHeader('Content-Type', mime);
    fileStream.pipe(response);
  }
}
