import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import * as process from 'process';

@Injectable()
export class S3FilesRepository {
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

  async saveFile(
    photo: Buffer,
    key: string,
    mimetype: string,
  ): Promise<{ url: string; fileId: string }> {
    const bucketParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: photo,
      ContentType: mimetype,
    };
    const command = new PutObjectCommand(bucketParams);
    const url = process.env.AWS_IMG_URL + `/${key}`;
    try {
      const result: PutObjectCommandOutput = await this.s3Client.send(command);
      return {
        url,
        fileId: result.ETag,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteFile(filePatch: string) {
    const bucketParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePatch,
    };
    try {
      await this.s3Client.send(new DeleteObjectCommand(bucketParams));
    } catch (error) {
      throw new Error(error);
    }
  }
}
