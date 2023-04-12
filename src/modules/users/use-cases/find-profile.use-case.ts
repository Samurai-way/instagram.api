import { Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { UsersRepository } from '../repository/users.repository';
import { ConfigService } from '@nestjs/config';
import { UserProfileModel } from '../types/types';

@Injectable()
export class FindProfileCommand {
  constructor(readonly userId: string) {}
}

@CommandHandler(FindProfileCommand)
export class FindProfileUseCase implements ICommand {
  constructor(
    public readonly usersRepo: UsersRepository,
    public readonly configService: ConfigService,
  ) {}

  async execute({ userId }: FindProfileCommand): Promise<UserProfileModel> {
    const profile = await this.usersRepo.findProfileByUserId(userId);
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
