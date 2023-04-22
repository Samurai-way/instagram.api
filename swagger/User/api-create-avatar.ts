import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { fileSchema } from './file-schema';
import { userProfilePhoto } from './user-profile';
import { BadRequestApi } from '../Auth/bad-request-schema-example';

export function ApiCreateAvatarSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Upload users avatar',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({ schema: fileSchema }),
    ApiResponse({
      status: 201,
      description: 'Return profile photo',
      schema: { example: userProfilePhoto },
    }),
    ApiBadRequestResponse({
      description: 'If file format is incorrect',
      schema: BadRequestApi,
    }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
