import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { apiResponse } from './api-response';
import { PostViewModel } from '../../src/modules/posts/dto/postViewModel';
import { apiBadRequestResponse } from './api-bad-request-response';

export function ApiFindPostByIdSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Find post by id' }),
    ApiResponse(apiResponse('Find post by id', PostViewModel)),
    ApiBadRequestResponse(apiBadRequestResponse),
  );
}
