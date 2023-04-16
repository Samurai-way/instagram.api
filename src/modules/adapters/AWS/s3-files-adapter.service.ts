import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3FilesAdapterService {
  constructor(private configService: ConfigService) {}

  async saveFiles(file: Express.Multer.File) {}
}
