import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ExtractDeviceIdFromRequest = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
  },
);
