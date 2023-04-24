import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT, JwtPairType, TokensVerifyViewModal } from '../constants';

const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(public jwtService: JwtService) {}

  async createJwtPair(userId: string, deviceId: string): Promise<JwtPairType> {
    const payload = { userId: userId, deviceId: deviceId };
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: '500m',
        secret: JWT.jwt_secret,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '10000m',
        secret: JWT.jwt_secret,
      }),
    };
  }

  async getLastActiveDateFromRefreshToken(
    refreshToken: string,
  ): Promise<string> {
    const payload: any = await jwt.decode(refreshToken);
    return new Date(payload.iat * 1000).toISOString();
  }

  async tokenVerify(token: string): Promise<TokensVerifyViewModal> {
    try {
      return jwt.verify(token, JWT.jwt_secret);
    } catch (error) {
      return null;
    }
  }
}
