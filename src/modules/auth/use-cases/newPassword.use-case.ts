import { Injectable, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewPasswordDto } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from '../../users/repository/users.repository';
import { PasswordRecovery, User } from '@prisma/client';

@Injectable()
export class NewPasswordCommand {
  constructor(readonly dto: NewPasswordDto) {}
}

@CommandHandler(NewPasswordCommand)
export class NewPasswordUseCase implements ICommandHandler {
  constructor(public usersRepository: UsersRepository) {}

  async execute(command: NewPasswordCommand): Promise<User> {
    const user: PasswordRecovery =
      await this.usersRepository.findUserByRecoveryCode(
        command.dto.recoveryCode,
      );
    if (!user)
      throw new NotFoundException([
        {
          message: 'User by code not found',
          field: 'recoveryCode',
        },
      ]);
    const passwordHash = await bcrypt.hash(command.dto.newPassword, 5);
    return this.usersRepository.updateUserHash(passwordHash, user.email);
  }
}
