import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthRepository {
  constructor() {} // @InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>,

  // async findUserByLogin(login: string): Promise<UserModel> {
  //   return this.usersModel.findOne({ login });
  // }
  // async findUserByEmail(email: string): Promise<UserModel> {
  //   return this.usersModel.findOne({ email });
  // }
}
