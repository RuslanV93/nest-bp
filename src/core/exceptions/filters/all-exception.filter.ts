import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter, ErrorMessage } from './base-exception.filter';
import { Response } from 'express';

// Интерфейс для описания структуры ошибки

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  onCatch(exception: unknown, response: Response): void {
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === 400) {
      const responseMessage: ErrorMessage = (exception as any).response.message;
      response.status(status).json({
        errorsMessages: responseMessage,
      });
    } else {
      response
        .status(status)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        .json({ errorsMessages: (exception as any).response });
    }
  }
}
