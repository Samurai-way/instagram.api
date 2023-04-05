import { IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IpDto {
  @ApiProperty({
    description: 'Device ip',
    example: '1',
    type: 'string',
    format: 'ip',
  })
  @IsString()
  ip: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  title: string;
}
