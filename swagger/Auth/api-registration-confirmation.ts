import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BadRequestApi } from './bad-request-schema-example';
import { tooManyRequestsMessage } from './too-many-requests-message';

export function ApiRegistrationConfirmationSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm registration.' }),
    ApiResponse({
      status: 204,
      description: 'Email was verified. Account was activated',
    }),
    ApiBadRequestResponse({
      description:
        'If the confirmation code is incorrect, expired or already been applied',
      schema: BadRequestApi,
    }),
    ApiTooManyRequestsResponse({ description: tooManyRequestsMessage }),
  );
}
