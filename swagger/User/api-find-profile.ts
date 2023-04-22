import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { userProfile } from './user-profile';

export function ApiFindProfileSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Users profile with his information' }),
    ApiResponse({
      status: 200,
      description: 'Successfully return users profile',
      schema: { example: userProfile },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
  );
}
