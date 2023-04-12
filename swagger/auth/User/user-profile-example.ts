import { UserProfileModel } from '../../../src/modules/users/types/types';

export const userProfileExample: UserProfileModel = {
  name: 'string',
  surname: 'string',
  aboutMe: 'string',
  city: 'string',
  dateOfBirthday: new Date('2023-04-10T16:20:10.847Z'),
  photo:
    'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg',
};
