import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Description',
    example: 'Post description',
    type: 'String',
    minLength: 1,
    maxLength: 500,
  })
  @Length(1, 500)
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Photo',
    example: 'Multipart form data',
    format: 'Binary',
  })
  postPhoto: Express.Multer.File;
}

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post description',
    example: 'Hello world',
    format: 'String',
    minLength: 1,
    maxLength: 500,
  })
  @Length(1, 500)
  @IsString()
  description: string;
}
