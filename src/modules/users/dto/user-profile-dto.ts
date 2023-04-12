import { IsDate, IsOptional, IsString, Length, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileDto {
  @ApiProperty({
    description: 'Users name',
    example: 'string',
    type: 'string',
    required: false,
  })
  @Length(1, 30)
  @IsString()
  @IsOptional()
  name: string;
  @ApiProperty({
    description: 'User surname',
    example: 'string',
    type: 'string',
    required: false,
  })
  @Length(1, 30)
  @IsString()
  @IsOptional()
  surname: string;
  @ApiProperty({
    description: 'User date of birthday',
    example: 'some date',
    type: 'string',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date())
  @IsOptional()
  dateOfBirthday: Date;
  @ApiProperty({
    description: 'User city',
    example: 'string',
    type: 'string',
    required: false,
  })
  @Length(1, 30)
  @IsString()
  @IsOptional()
  city: string;
  @ApiProperty({
    description: 'Information about user',
    example: 'string',
    type: 'string',
    required: false,
  })
  @Length(1, 200)
  @IsString()
  @IsOptional()
  aboutMe: string;
}
