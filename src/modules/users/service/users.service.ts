import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(public usersRepo: UsersRepository) {}

  async checkUserCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<User> {
    const user: User = await this.usersRepo.findUserByLoginOrEmail(
      loginOrEmail,
    );
    if (!user) throw new UnauthorizedException();
    const passwordComparison = await bcrypt.compare(
      password,
      user.passwordHash,
    );
    if (!passwordComparison) throw new UnauthorizedException();
    return user;
  }
}
