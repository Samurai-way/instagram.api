import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { tooManyRequestsMessage } from './too-many-requests-message';

export function ApiPasswordRecoverySwagger() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
    }),
    ApiResponse({
      status: 204,
      description:
        "Even if current email is not registered (for prevent user's email detection)",
    }),
    ApiBadRequestResponse({
      description:
        'If the inputModel has invalid email (for example 222^gmail.com)',
    }),
    ApiTooManyRequestsResponse({
      description: tooManyRequestsMessage,
    }),
  );
}
