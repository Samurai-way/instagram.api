import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUserDataModel } from './auth-user-model';

export function ApiMeSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Get information about current user' }),
    ApiResponse({
      status: 200,
      description: 'Success',
      schema: {
        example: {
          email: 'string',
          login: 'string',
          userId: 'string',
        } as AuthUserDataModel,
      },
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
