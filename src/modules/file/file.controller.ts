import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommandBus } from '@nestjs/cqrs';
import { UploadFileCommand } from './use-cases/upload-file.use-case';

@Controller('file')
export class FileController {
  constructor(public command: CommandBus) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStaticFiles(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.command.execute(new UploadFileCommand(file));
    } catch (e) {
      return null;
    }
  }
}
