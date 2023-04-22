import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BadRequestApi } from './bad-request-schema-example';
import { tooManyRequestsMessage } from './too-many-requests-message';

export function ApiRegistrationEmailResendingSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend confirmation registration Email if user exists',
    }),
    ApiResponse({
      status: 204,
      description:
        'Input data is accepted.Email with confirmation code will be send to passed email address.Confirmation code should be inside link as query param, for example: https://some-front.com/confirm-registration?code=youtcodehere',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      schema: BadRequestApi,
    }),
    ApiTooManyRequestsResponse({ description: tooManyRequestsMessage }),
  );
}
