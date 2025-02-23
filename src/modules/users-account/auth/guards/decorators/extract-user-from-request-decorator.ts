import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ObjectId } from 'mongodb';

export const ExtractUserFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as { id: ObjectId };

    if (!user) {
      return { id: null };
    }

    return { ...user, id: new ObjectId(user.id) };
  },
);
