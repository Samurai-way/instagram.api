import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export const DeviceInfoDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      ip: request.ip,
      title: request.headers['user-agent'] || 'browser not found',
      deviceId: uuid(),
    };
  },
);
