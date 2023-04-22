import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiDeleteAllDevicesSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: "Terminate all other (exclude current) device's sessions",
    }),
    ApiResponse({ status: 204, description: 'No content' }),
    ApiUnauthorizedResponse({
      description:
        'If the JWT refreshToken inside cookie is missing, expired or incorrect',
    }),
  );
}
