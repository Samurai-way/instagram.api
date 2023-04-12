export class User {
  constructor(
    public id: string,
    public login: string,
    public passwordHash: string,
    public email: string,
    public createdAt: string,
    public emailConfirmation: {
      confirmationCode: string;
      expirationDate: Date;
      isConfirmed: boolean;
    },
  ) {}
}

export class UserProfileModel {
  name: string;
  surname: string;
  dateOfBirthday: Date;
  city: string;
  aboutMe: string;
  photo: string;
}
