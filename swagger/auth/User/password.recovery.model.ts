import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from './user.model';

export class PasswordRecovery {
  @ApiProperty({
    description: 'Уникальный идентификатор записи в формате UUID.',
    example: 'a5d054e5-5cf5-4a5b-b3e3-b4c4d4fe47b4',
  })
  id: string;

  @ApiProperty({
    description:
      'Адрес электронной почты, связанный с запросом на восстановление пароля.',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Уникальный код восстановления пароля.',
    example: '65sdf13',
  })
  recoveryCode: string;

  @ApiProperty({
    description: 'Связанный пользователь.',
    type: () => UserModel,
  })
  user: UserModel;

  @ApiProperty({
    description: 'Идентификатор связанного пользователя.',
    example: 'a5d054e5-5cf5-4a5b-b3e3-b4c4d4fe47b4',
  })
  userId: string;
}
