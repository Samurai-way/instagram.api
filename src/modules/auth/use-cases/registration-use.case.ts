import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthDto } from '../dto/auth.dto';
import { UsersRepository } from '../../users/repository/users.repository';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { EmailService } from '../../email/email.service';
import { User } from '@prisma/client';

@Injectable()
export class RegistrationCommand {
  constructor(readonly dto: AuthDto) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationUseCase
  implements ICommandHandler<RegistrationCommand>
{
  constructor(
    public usersRepo: UsersRepository,
    public emailService: EmailService,
  ) {}

  async execute(command: RegistrationCommand): Promise<User> {
    const userByEmail = await this.usersRepo.findUserByEmail(command.dto.email);
    if (userByEmail)
      throw new BadRequestException([
        {
          message: 'User with this email is registered',
          field: 'email',
        },
      ]);
    const userByLogin = await this.usersRepo.findUserByLogin(command.dto.login);
    if (userByLogin)
      throw new BadRequestException([
        {
          message: 'User with this email is registered',
          field: 'email',
        },
      ]);
    const passwordHash = await bcrypt.hash(command.dto.password, 5);
    const confirmationCode = randomUUID();
    try {
      const user = await this.usersRepo.createUser(
        command.dto,
        passwordHash,
        confirmationCode,
      );
      await this.emailService.sendConfirmationCodeByEmail(
        command.dto.email,
        confirmationCode,
      );
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
