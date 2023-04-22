import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { deviceViewModelExample } from './device=view=model-example';

export function ApiFindAllDevicesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Returns all devices with active sessions for current user',
    }),
    ApiResponse({
      status: 200,
      description: 'Success',
      schema: { example: [deviceViewModelExample] },
    }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}
