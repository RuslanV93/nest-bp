import { AllExceptionsFilter } from '../core/exceptions/filters/all-exception.filter';
import { INestApplication } from '@nestjs/common';
import { DomainExceptionsFilter } from '../core/exceptions/filters/domain-exception.fllter';

export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionsFilter());
}
