import { IsDate, IsOptional, IsString, Length, MaxDate } from 'class-validator';
import { Type } from 'class-transformer';

export class UserProfileDto {
  @Length(1, 30)
  @IsString()
  @IsOptional()
  name: string;
  @Length(1, 30)
  @IsString()
  @IsOptional()
  surname: string;
  @IsDate()
  @Type(() => Date)
  @MaxDate(new Date())
  @IsOptional()
  dateOfBirthday: Date;
  @Length(1, 30)
  @IsString()
  @IsOptional()
  city: string;
  @Length(1, 200)
  @IsString()
  @IsOptional()
  aboutMe: string;
}
