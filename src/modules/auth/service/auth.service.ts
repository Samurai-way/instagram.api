import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT, JwtPairType, TokensVerifyViewModal } from '../constants';
import jwt from 'jsonwebtoken';
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
    const payload = { userId: userId };
    const jwtPair = {
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
    console.log('refreshToken', refreshToken);
    const payload: any = jwt.decode(refreshToken);
    console.log('payload', payload);
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
