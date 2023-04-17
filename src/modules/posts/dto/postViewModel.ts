import { ApiProperty } from '@nestjs/swagger';

export class PostViewModel {
  @ApiProperty({
    description: 'Id',
    example: '12345',
    type: 'String',
  })
  id: string;
  @ApiProperty({
    description: 'Photo url',
    example: 'https://url.com/photo.jpg',
    type: 'String',
    format: 'Url',
  })
  postPhoto: string;
  @ApiProperty({
    description: 'Post description',
    example: 'Hello world',
    type: 'String',
  })
  description: string;
  @ApiProperty({
    description: 'Date when post was created',
    example: new Date('2023-04-10T16:20:10.847Z'),
    type: 'String',
  })
  createdAt: Date;
  @ApiProperty({
    description: 'Date when post was created',
    example: new Date('2023-04-10T16:20:10.847Z'),
    type: 'String',
  })
  updatedAt: Date;
}
