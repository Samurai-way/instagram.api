import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdatePostDto } from '../../src/modules/posts/dto/post.dto';
import { apiResponse } from './api-response';
import { PostViewModel } from '../../src/modules/posts/dto/postViewModel';
import { apiUnauthorizedResponse } from './api-unauthorized-response';

export function ApiUpdatePostSwagger() {
  return applyDecorators(
    ApiOperation({ summary: 'Update post by id' }),
    ApiBody({ type: UpdatePostDto }),
    ApiResponse(apiResponse('Returns updated post', PostViewModel)),
    ApiUnauthorizedResponse(apiUnauthorizedResponse),
    ApiBadRequestResponse(),
  );
}
