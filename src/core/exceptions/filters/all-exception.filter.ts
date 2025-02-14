import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter, ErrorMessage } from './base-exception.filter';
import { Response, Request } from 'express';

// Интерфейс для описания структуры ошибки
interface ResponseBody {
  message: ErrorMessage[];
  error: string;
  statusCode: HttpStatus;
}

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  onCatch(
    exception: HttpException,
    response: Response,
    request: Request,
  ): void {
    const status = exception.getStatus();

    const responseBody = exception.getResponse() as ResponseBody;

    response
      .status(status)
      .json(this.formatMultipleErrors(responseBody.message));
  }
}
