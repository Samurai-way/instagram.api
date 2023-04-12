import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { UserProfileDto } from '../dto/user-profile-dto';
import { UsersRepository } from '../repository/users.repository';
import { ConfigService } from '@nestjs/config';
import { UserProfileModel } from '../types/types';

@Injectable()
export class UpdateProfileCommand {
  constructor(readonly dto: UserProfileDto, readonly userId: string) {}
}

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileUseCase implements ICommand {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute({
    userId,
    dto,
  }: UpdateProfileCommand): Promise<UserProfileModel> {
    const profile = await this.usersRepo.updateUsersProfileByUserId(
      userId,
      dto,
    );
    return {
      name: profile.name,
      city: profile.city,
      surname: profile.surname,
      aboutMe: profile.aboutMe,
      dateOfBirthday: profile.dateOfBirthday,
      photo: profile.photo
        ? this.configService.get('FILES_URL') + profile.photo
        : null,
    };
  }
}
