import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../../users/service/users.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<User | any> {
    const user = await this.usersService.checkUserCredentials(
      loginOrEmail,
      password,
    );
    if (user.banInfo.isBanned)
      throw new UnauthorizedException(['User is banned']);
    if (!user) throw new NotFoundException([]);
    return user;
  }
}
