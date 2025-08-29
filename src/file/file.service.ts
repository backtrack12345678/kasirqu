import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FileService {
  getHostFile(request: Request): string {
    const protocol: string =
      process.env.NODE_ENV === 'production' ? 'https' : request.protocol;
    return protocol + '://' + request.get('host');
  }
}
