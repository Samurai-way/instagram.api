import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: 'User login',
    example: 'John',
    type: 'string',
    minLength: 3,
    maxLength: 10,
  })
  @Length(3, 10)
  login: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: 'User password',
    example: 'string',
    type: 'string',
    minLength: 6,
    maxLength: 20,
  })
  @Length(6, 20)
  password: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
    type: 'string',
    format: 'email',
  })
  @IsEmail()
  email: string;
}

export class NewPasswordDto {
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @Length(6, 20)
  newPassword: string;
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  recoveryCode: string;
}
