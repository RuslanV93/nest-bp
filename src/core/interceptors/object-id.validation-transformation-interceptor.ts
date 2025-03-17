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

    if (path === '/api/security/devices/:id') {
      return next.handle();
    }

    if (request.params?.blogId && request.params?.postId) {
      if (
        !isValidObjectId(request.params?.blogId) ||
        !isValidObjectId(request.params?.postId)
      ) {
        throw new BadRequestException([
          { message: `Id is not a valid ObjectId.`, field: 'id' },
        ]);
      }
      request.params.blogId = new ObjectId(request.params?.blogId);
      request.params.postId = new ObjectId(request.params.postId);
      return next.handle();
    }

    if (request.params?.id) {
      const id = request.params.id;
      if (!isValidObjectId(id)) {
        throw new BadRequestException([
          { message: `Id is not a valid ObjectId.`, field: 'id' },
        ]);
      }
      request.params.id = new ObjectId(id);
    }

    return next.handle();
  }
}
