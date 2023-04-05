import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EmailService } from '../../email/email.service';
import { UsersRepository } from '../../users/repository/users.repository';
import { randomUUID } from 'crypto';

@Injectable()
export class PasswordRecoveryCommand {
  constructor(readonly email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler {
  constructor(
    public usersRepository: UsersRepository,
    public emailService: EmailService,
  ) {}

  async execute(command: PasswordRecoveryCommand): Promise<boolean> {
    const user: any = await this.usersRepository.findUserByEmail(command.email);
    if (!user)
      throw new NotFoundException([
        {
          message: 'user not found',
          field: 'email',
        },
      ]);
    const recoveryCode: string = randomUUID();
    try {
      await this.usersRepository.updatePasswordRecoveryModel(
        recoveryCode,
        command.email,
      );
      await this.emailService.sendPasswordRecoveryCode(
        user.email,
        recoveryCode,
      );
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}