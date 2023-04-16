import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  bucketName = this.configService.get('AWS_BUCKET_NAME');
  s3 = new S3({
    region: this.configService.get('AWS_REGION'),
    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
  });

  async uploadFile(dataBuffer: Buffer, fileName: string) {
    try {
      const res = await this.s3
        .upload({
          Bucket: this.bucketName,
          Body: dataBuffer,
          Key: `${fileName}`,
          ACL: 'public-read',
          ContentDisposition: 'inline',
        })
        .promise();
      console.log('res', res);
      return res;
    } catch (e) {
      console.log(e);
    }
  }
}
