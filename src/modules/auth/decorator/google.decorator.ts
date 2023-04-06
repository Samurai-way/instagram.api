import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

export const GoogleAuthDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return {
      email: request.user.email,
      password: uuid(),
      login: uuid(),
    };
  },
);
