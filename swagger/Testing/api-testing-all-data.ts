import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function ApiTestingAllDataSwagger() {
  return applyDecorators(
    ApiOperation({
      summary: 'Clear all data of db',
    }),
    ApiResponse({
      status: 204,
      description: 'No content',
    }),
  );
}
