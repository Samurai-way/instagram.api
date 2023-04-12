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
        createLogicError('email', 'User with this email is registered'),
      ]);
    const userByLogin = await this.usersRepo.findUserByLogin(command.dto.login);
    if (userByLogin)
      throw new BadRequestException([
        new LogicError('login', 'User with this login is registered'),
      ]);
    const passwordHash = await bcrypt.hash(command.dto.password, 5);
    const confirmationCode = randomUUID();

    const user = await this.usersRepo.createUser(
      command.dto,
      passwordHash,
      confirmationCode,
    );
    try {
      await this.emailService.sendConfirmationCodeByEmail(
        command.dto.email,
        confirmationCode,
      );
      return user;
    } catch (e) {
      throw new BadRequestException([
        new LogicError(
          'email',
          `Email no t sent for some reason. Try to resend code`,
        ),
      ]);
    }
  }
}

class LogicError {
  constructor(public field: string, public message: string) {}
}

const createLogicError = (field: string, message: string) => ({
  field,
  message,
});
