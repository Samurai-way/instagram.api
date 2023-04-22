import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BadRequestApi } from './bad-request-schema-example';
import { tooManyRequestsMessage } from './too-many-requests-message';

export function ApiGoogleSwagger() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      schema: BadRequestApi,
    }),
    ApiUnauthorizedResponse({
      description: 'If the password or login is wrong',
    }),
    ApiOperation({
      summary: 'Try login user to the system with google account',
    }),
    ApiResponse({
      status: 200,
      description:
        'Returns JWT accessToken (expired after 8 hours) in body and JWT refreshToken in cookie (http-only, secure) (expired after 30d ays).',
      schema: { example: { accessToken: 'string' } },
    }),
    ApiTooManyRequestsResponse({ description: tooManyRequestsMessage }),
  );
}
