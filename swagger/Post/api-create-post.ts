import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreatePostDto } from '../../src/modules/posts/dto/post.dto';
import { apiResponse } from './api-response';
import { PostViewModel } from '../../src/modules/posts/dto/postViewModel';
import { apiBadRequestResponse } from './api-bad-request-response';

export function ApiCreatePostSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Create post' }),
    ApiBody({ type: CreatePostDto }),
    ApiResponse(apiResponse('Return created post', PostViewModel, 201)),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiBadRequestResponse(apiBadRequestResponse),
  );
}
