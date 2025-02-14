import { DomainException } from '../domain-exception';
import { Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from './base-exception.filter';
import { DomainExceptionCode } from '../domain-exception.codes';
import { Response, Request } from 'express';

@Catch(DomainException)
export class DomainExceptionsFilter extends BaseExceptionFilter {
  onCatch(
    exception: DomainException,
    response: Response,
    request: Request,
  ): void {
    const errorsMessages = exception.extensions.map((ext) => ({
      message: ext.message,
      field: ext.key || 'none',
    }));
    response
      .status(this.calculateHttpCode(exception))
      .json(this.formatMultipleErrors(errorsMessages));
  }

  calculateHttpCode(exception: DomainException) {
    switch (exception.code) {
      case DomainExceptionCode.BadRequest: {
        return HttpStatus.BAD_REQUEST;
      }
      case DomainExceptionCode.Forbidden: {
        return HttpStatus.FORBIDDEN;
      }
      case DomainExceptionCode.NotFound: {
        return HttpStatus.NOT_FOUND;
      }
      case DomainExceptionCode.Unauthorized: {
        return HttpStatus.UNAUTHORIZED;
      }
      default: {
        return HttpStatus.I_AM_A_TEAPOT;
      }
    }
  }
}
