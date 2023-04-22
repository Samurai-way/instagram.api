import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRefreshTokenSwagger() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing). ' +
        'Device LastActiveDate should be overrode by issued Date of new refresh token',
    }),
    ApiResponse({
      status: 200,
      description:
        'Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30days).',
      schema: { example: { accessToken: 'string' } },
    }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}
