import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type AuthUser = {
  userId: string;
  businessId: string;
  phone: string;
  name: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as AuthUser;
  },
);
