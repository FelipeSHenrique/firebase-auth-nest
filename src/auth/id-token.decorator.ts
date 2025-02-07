import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | null => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const authorization =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.headers['authorization'] || request.headers['Authorization'];

    if (authorization && typeof authorization === 'string') {
      const [type, token] = authorization.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }
    return null;
  },
);
