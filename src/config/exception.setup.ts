import { AllExceptionsFilter } from '../core/exceptions/filters/all-exception.filter';
import { INestApplication } from '@nestjs/common';
import { DomainExceptionsFilter } from '../core/exceptions/filters/domain-exception.fllter';
import { ThrottlerExceptionFilter } from '../core/exceptions/throttler-exception.filter';

export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new DomainExceptionsFilter(),
    new ThrottlerExceptionFilter(),
  );
}
