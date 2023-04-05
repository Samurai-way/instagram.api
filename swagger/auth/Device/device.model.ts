import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../User/user.model';

export class Devices {
  @ApiProperty({
    description: 'Уникальный идентификатор записи в формате UUID.',
    example: 'a5d054e5-5cf5-4a5b-b3e3-b4c4d4fe47b4',
  })
  id: string;

  @ApiProperty({
    description: 'IP-адрес устройства.',
    example: '192.168.1.1',
  })
  ip: string;

  @ApiProperty({
    description: 'Название устройства.',
    example: 'Мой компьютер',
  })
  title: string;

  @ApiProperty({
    description: 'Дата последней активности устройства.',
    example: '2023-04-05T10:23:45Z',
  })
  lastActiveData: string;

  @ApiProperty({
    description: 'Уникальный идентификатор устройства.',
    example: 'f1e1d238-8345-4bb3-8c32-cce20d4d4b06',
  })
  deviceId: string;

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
