import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BadRequestApi } from './bad-request-schema-example';
import { tooManyRequestsMessage } from './too-many-requests-message';

export function ApiRegistrationSwagger() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Registration in the system. Email with confirmation code will be send to passed email address.',
    }),
    ApiResponse({
      status: 204,
      description:
        'Input data is accepted. Email with confirmation code will be send to passed email address',
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has incorrect values (in particular if the user with the given email or login already exists)',
      schema: BadRequestApi,
    }),
    ApiTooManyRequestsResponse({ description: tooManyRequestsMessage }),
  );
}
