import { ApiProperty } from '@nestjs/swagger';
import { Devices, PasswordRecovery } from '@prisma/client';
import { EmailConfirmation } from './email-confirmation-model';
import { Devices } from '../Device/device.model';

export class UserModel {
  @ApiProperty({
    description: 'Уникальный идентификатор пользователя в формате UUID.',
  })
  id: string;

  @ApiProperty({ description: 'Логин пользователя.' })
  login: string;

  @ApiProperty({ description: 'Адрес электронной почты пользователя.' })
  email: string;

  @ApiProperty({ description: 'Хэш пароля пользователя.' })
  passwordHash: string;

  @ApiProperty({ description: 'Дата создания записи пользователя.' })
  createdAt: Date;

  @ApiProperty({
    description: 'Запись подтверждения адреса электронной почты пользователя.',
  })
  emailConfirmation: EmailConfirmation;

  @ApiProperty({ description: 'Запись восстановления пароля пользователя.' })
  passwordRecovery: PasswordRecovery;

  @ApiProperty({ description: 'Список устройств, принадлежащих пользователю.' })
  devices: Devices[];
}
