import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserProfileDto } from '../../src/modules/users/dto/user-profile-dto';
import { userProfile } from './user-profile';
import { BadRequestApi } from '../Auth/bad-request-schema-example';

export function ApiUpdateProfileSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update current user profile' }),
    ApiBody({
      description: 'Example request body (all fields not required)',
      type: UserProfileDto,
    }),
    ApiResponse({
      status: 200,
      description: 'Returns updated profile',
      schema: { example: userProfile },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiBadRequestResponse({
      description: 'If the inputModel has incorrect values',
      schema: BadRequestApi,
    }),
  );
}
