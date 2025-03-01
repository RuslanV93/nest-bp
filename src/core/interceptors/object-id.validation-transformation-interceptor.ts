import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Observable } from 'rxjs';

@Injectable()
export class ObjectIdValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const path = request.route.path;

    if (!request.params?.id) {
      return next.handle();
    }

    if (path === '/api/security/devices/:id') {
      return next.handle();
    }

    const id = request.params.id;
    if (!isValidObjectId(id)) {
      throw new BadRequestException([
        { message: `Id is not a valid ObjectId.`, field: 'id' },
      ]);
    }

    request.params.id = new ObjectId(id);

    return next.handle();
  }
}
