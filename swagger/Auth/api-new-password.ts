import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { tooManyRequestsMessage } from './too-many-requests-message';

export function ApiNewPasswordSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Confirm password recovery' }),
    ApiResponse({
      status: 204,
      description: 'If code is valid and new password is accepted',
    }),
    ApiForbiddenResponse({ description: 'If code is wrong' }),
    ApiTooManyRequestsResponse({ description: tooManyRequestsMessage }),
    ApiNotFoundResponse({ description: 'If user with this code doesnt exist' }),
  );
}
