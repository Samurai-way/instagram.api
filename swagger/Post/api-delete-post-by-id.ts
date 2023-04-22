import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { apiUnauthorizedResponse } from './api-unauthorized-response';
import { apiBadRequestResponse } from './api-bad-request-response';

export function ApiDeletePostByIdSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete post by id' }),
    ApiResponse({ status: 204 }),
    ApiUnauthorizedResponse(apiUnauthorizedResponse),
    ApiBadRequestResponse(apiBadRequestResponse),
  );
}
