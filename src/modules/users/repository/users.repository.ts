import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  EmailConfirmation,
  PasswordRecovery,
  Profile,
  User,
} from '@prisma/client';
import { AuthDto } from '../../auth/dto/auth.dto';
import { randomUUID } from 'crypto';
import { add } from 'date-fns';
import { UserProfileDto } from '../dto/user-profile-dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    dto: AuthDto,
    passwordHash: string,
    confirmationCode: string,
  ): Promise<User> {
    return this.prisma.user.create({
      data: {
        id: randomUUID(),
        email: dto.email,
        createdAt: new Date(),
        login: dto.login,
        passwordHash: passwordHash,
        emailConfirmation: {
          create: {
            id: randomUUID(),
            isConfirmed: false,
            confirmationCode: confirmationCode,
            expirationDate: add(new Date(), { hours: 1 }),
          },
        },
        passwordRecovery: {
          create: {
            id: randomUUID(),
            email: dto.email,
            recoveryCode: randomUUID(),
          },
        },
      },
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: { emailConfirmation: true, passwordRecovery: true },
    });
  }

  async findUserById(id: string): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findUserByLogin(login: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        login: login,
      },
    });
  }

  async findUserByLoginOrEmail(loginOrEmail: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: loginOrEmail,
          },
          {
            login: loginOrEmail,
          },
        ],
      },
      include: { emailConfirmation: true, passwordRecovery: true },
    });
  }

  async findUserByCode(code: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        emailConfirmation: {
          confirmationCode: code,
        },
      },
      include: { emailConfirmation: true, passwordRecovery: true },
    });
  }

  async updateEmailConfirmationIsConfirmed(
    code: string,
  ): Promise<EmailConfirmation> {
    return this.prisma.emailConfirmation.update({
      where: { confirmationCode: code },
      data: { isConfirmed: true },
    });
  }

  async updateUserHash(passwordHash: string, email: string): Promise<User> {
    return this.prisma.user.update({
      where: { email },
      data: { passwordHash },
    });
  }

  async updateEmailConfirmationConfirmationCode(
    newCode: string,
    oldCode: string,
  ): Promise<EmailConfirmation> {
    return this.prisma.emailConfirmation.update({
      where: { confirmationCode: oldCode },
      data: { confirmationCode: newCode },
    });
  }

  async updatePasswordRecoveryModel(
    recoveryCode: string,
    email: string,
  ): Promise<PasswordRecovery> {
    return this.prisma.passwordRecovery.update({
      where: { email },
      data: { recoveryCode },
    });
  }

  async findUserByRecoveryCode(
    recoveryCode: string,
  ): Promise<PasswordRecovery> {
    return this.prisma.passwordRecovery.findFirst({ where: { recoveryCode } });
  }

  async updateUsersProfileByUserId(
    userId: string,
    dto: UserProfileDto,
  ): Promise<Profile> {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        name: dto.name,
        surname: dto.surname,
        dateOfBirthday: dto.dateOfBirthday,
        city: dto.city,
        aboutMe: dto.aboutMe,
      },
    });
  }
  async findProfileByUserId(userId: string): Promise<Profile> {
    return this.prisma.profile.findFirst({ where: { userId } });
  }
}
