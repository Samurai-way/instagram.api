import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FileService } from '../../file/file.service';
import { S3Service } from '../../adapters/AWS/S3.service';

@Injectable()
export class UploadFileCommand {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;

  constructor(photo: Express.Multer.File | UploadFileCommand) {
    console.log('photo', photo);
    this.buffer = photo.buffer;
    this.mimetype = photo.mimetype;
    this.originalname = photo.originalname;
    this.size = photo.size;
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
