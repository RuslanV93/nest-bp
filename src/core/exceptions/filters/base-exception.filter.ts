import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export type ErrorMessage = {
  message: string;
  field: string;
};

interface ErrorResponse {
  errorsMessages: ErrorMessage[];
}

@Catch(HttpException)
export abstract class BaseExceptionFilter implements ExceptionFilter {
  abstract onCatch(exception: any, response: Response, request: Request);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.onCatch(exception, response, request);
  }
  protected formatErrorResponse(
    message: string,
    field: string = 'none',
  ): ErrorResponse {
    return {
      errorsMessages: [
        {
          message,
          field,
        },
      ],
    };
  }
  protected formatMultipleErrors(errors: ErrorMessage[]): ErrorResponse {
    return {
      errorsMessages: errors,
    };
  }
}
