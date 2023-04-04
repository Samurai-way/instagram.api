import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT, JwtPairType, TokensVerifyViewModal } from '../constants';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(public jwtService: JwtService) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  async createJwtPair(userId: string, deviceId: string): Promise<JwtPairType> {
    const payload = { userId: userId, deviceId: deviceId };
    const jwtPair: JwtPairType = {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '5m',
        secret: JWT.jwt_secret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '10m',
        secret: JWT.jwt_secret,
      }),
    };
    return jwtPair;
  }

  getLastActiveDateFromRefreshToken(refreshToken: string): string {
    const payload: any = jwt.decode(refreshToken);
    return new Date(payload.iat * 1000).toISOString();
  }

  async tokenVerify(token: string): Promise<TokensVerifyViewModal> {
    try {
      const result: any = jwt.verify(token, JWT.jwt_secret);
      return result;
    } catch (error) {
      return null;
    }
  }
}
