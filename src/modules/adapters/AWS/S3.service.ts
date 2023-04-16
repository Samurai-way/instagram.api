import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { UploadFileCommand } from '../../users/use-cases/upload-file.use-case';
import * as process from 'process';

@Injectable()
export class S3Service {
  constructor(private configService: ConfigService) {}

  bucketName = this.configService.get(process.env.AWS_BUCKET_NAME);
  s3 = new S3({
    accessKeyId: this.configService.get(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: this.configService.get(process.env.AWS_SECRET_ACCESS_KEY),
  });

  async uploadFile(file: Express.Multer.File | UploadFileCommand) {
    try {
      const uploadResult = await this.s3
        .upload({
          Bucket: this.bucketName,
          Body: file.buffer,
          Key: `${uuid() + file.originalname}`,
          ACL: 'public-read',
          ContentDisposition: 'Inline',
          ContentType: file.mimetype,
        })
        .promise();
      console.log('uploadResult', uploadResult);
      return uploadResult;
    } catch (e) {
      console.log(e);
    }
  }
}
