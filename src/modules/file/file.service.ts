import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { UploadFileCommand } from '../users/use-cases/upload-file.use-case';

@Injectable()
export class FileService {
  constructor() {}

  async filterFile(file: UploadFileCommand) {
    const mimetype = file.mimetype;
    const currentFileType = file.mimetype.split('/')[1];
    const newName = file.originalname.split('.')[0];
    const type = file.originalname.split('.')[1];
    const size = file.size;

    if (mimetype.includes('image')) {
      if (currentFileType != 'svg+xml') {
        const buffer = await this.convertToWebP(file.buffer);
        return new UploadFileCommand({
          buffer,
          originalname: `${newName}.webp`,
          mimetype,
          size,
        });
      }
      return new UploadFileCommand({
        buffer: file.buffer,
        originalname: `${newName}.svg`,
        mimetype,
        size,
      });
    }
    return new UploadFileCommand({
      buffer: file.buffer,
      originalname: `${newName}.${type}`,
      mimetype,
      size,
    });
  }

  async convertToWebP(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
