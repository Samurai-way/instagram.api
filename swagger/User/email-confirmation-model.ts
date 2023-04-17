import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from './user.model';

export class EmailConfirmation {
  @ApiProperty({
    description:
      'Уникальный идентификатор записи подтверждения адреса электронной почты в формате UUID.',
    example: 'a5d054e5-5cf5-4a5b-b3e3-b4c4d4fe47b4',
  })
  id: string;

  @ApiProperty({
    description: 'Уникальный код подтверждения адреса электронной почты.',
    example: '65sdf13',
  })
  confirmationCode: string;

  @ApiProperty({
    description:
      'Дата и время истечения срока действия кода подтверждения адреса электронной почты.',
    example: '2022-06-30T12:30:00Z',
  })
  expirationDate: Date;

  @ApiProperty({
    description: 'Подтвержден ли адрес электронной почты.',
    example: false,
  })
  isConfirmed: boolean;

  @ApiProperty({
    description: 'Связанный пользователь.',
    type: () => UserModel,
  })
  user?: UserModel;

  @ApiProperty({
    description: 'Идентификатор связанного пользователя.',
    example: 'a5d054e5-5cf5-4a5b-b3e3-b4c4d4fe47b4',
  })
  userId: string;
}
