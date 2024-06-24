import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/user/user.model';

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest();
    return request.user.get();
  },
);
