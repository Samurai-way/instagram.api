import { IsString, Length } from 'class-validator';

export class CreatePostDto {
  @Length(1, 500)
  @IsString()
  description: string;
  postPhoto: Express.Multer.File;
}
