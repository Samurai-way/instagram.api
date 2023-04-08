import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileService } from '../file.service';
import { S3Service } from '../../adapters/AWS/S3.service';

@Injectable()
export class UploadFileCommand {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;

  constructor(file: Express.Multer.File | UploadFileCommand) {
    this.buffer = file.buffer;
    this.mimetype = file.mimetype;
    this.originalname = file.originalname;
    this.size = file.size;
  }
}

@CommandHandler(UploadFileCommand)
export class UploadFileUseCase implements ICommandHandler<UploadFileCommand> {
  constructor(private fileService: FileService, private s3Service: S3Service) {}

  async execute(command: UploadFileCommand) {
    const convertFile = await this.fileService.filterFile(command);
    return this.s3Service.uploadFile(convertFile);
  }
}
