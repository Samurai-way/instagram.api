export const JWT = {
  jwt_secret: '12345',
};

export class JwtPairType {
  constructor(public accessToken: string, public refreshToken: string) {}
}
export class loginOrEmailType {
  constructor(public loginOrEmail: string, public password: string) {}
}

export class TokensVerifyViewModal {
  constructor(
    public userId: string,
    public deviceId: string,
    public iat: number,
    public exp: number,
  ) {}
}
