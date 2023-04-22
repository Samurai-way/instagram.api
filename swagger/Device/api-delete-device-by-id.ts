import { applyDecorators } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiDeleteDeviceByIdSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Terminate specified device session' }),
    ApiParam({ name: 'deviceId', type: 'string' }),
    ApiResponse({ status: 204, description: 'No Content' }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
    ApiForbiddenResponse({
      description: 'If try to delete the deviceId of other user',
    }),
    ApiNotFoundResponse({ description: 'Not Found' }),
  );
}
