import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { S3FilesAdapterService } from '../../adapters/AWS/s3-files-adapter.service';

@Injectable()
export class UploadFileCommand {
  constructor(readonly userId: string, readonly photo: Express.Multer.File) {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileUseCase implements ICommand {
  constructor(public s3: S3FilesAdapterService) {}

  async execute({ userId, photo }: UploadFileCommand) {
    return this.s3.saveFiles(
      userId,
      photo.buffer,
      photo.fieldname,
      photo.mimetype,
    );
  }
}
