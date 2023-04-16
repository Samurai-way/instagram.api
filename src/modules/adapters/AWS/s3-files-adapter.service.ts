import { Injectable } from '@nestjs/common';
import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import * as process from 'process';

@Injectable()
export class S3FilesAdapterService {
  s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      },
    });
  }

  async saveFiles(
    userId: string,
    photo: Buffer,
    key: string,
    mimetype: string,
  ) {
    const bucketParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: photo,
      ContentType: mimetype,
    };
    const command = new PutObjectCommand(bucketParams);
    try {
      const result: PutObjectCommandOutput = await this.s3Client.send(command);
      console.log('res', result);
      return {
        url: key,
        fileId: result.ETag,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}
