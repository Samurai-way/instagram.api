import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandHandler, ICommand } from '@nestjs/cqrs';
import { EmailService } from '../../email/email.service';
import { UsersRepository } from '../../users/repository/users.repository';
import { randomUUID } from 'crypto';
import { EmailDto } from '../dto/auth.dto';

@Injectable()
export class EmailResendingCommand {
  constructor(readonly dto: EmailDto) {}
}

@CommandHandler(EmailResendingCommand)
export class EmailResendingUseCase implements ICommand {
  constructor(
    private emailService: EmailService,
    private usersRepo: UsersRepository,
  ) {}

  async execute(command: EmailResendingCommand): Promise<boolean> {
    const user: any = await this.usersRepo.findUserByEmail(command.dto.email);
    if (!user || user.emailConfirmation.isConfirmed)
      throw new BadRequestException([
        {
          message: 'User not found',
          field: 'email',
        },
      ]);
    const newCode = randomUUID();
    try {
      await this.usersRepo.updateEmailConfirmationConfirmationCode(
        newCode,
        user.emailConfirmation.confirmationCode,
      );
      await this.emailService.sendConfirmationCodeByEmail(
        command.dto.email,
        newCode,
      );
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
