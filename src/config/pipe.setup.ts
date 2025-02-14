import {
  BadRequestException,
  INestApplication,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ObjectIdValidationTransformationPipe } from '../core/pipes/object-id.validation-transformation-pipe';

const pipeErrorFormatter = (
  errors: ValidationError[],
  errorMessage?: { message: string; field: string }[],
) => {
  const errorsForResponse = errorMessage || [];

  for (const error of errors) {
    if (!error?.constraints && error?.children?.length) {
      pipeErrorFormatter(error.children, errorsForResponse);
    } else if (error.constraints) {
      const constraintKeys = Object.keys(error.constraints);
      for (const key of constraintKeys) {
        errorsForResponse.push({
          message: error.constraints[key],
          field: error.property,
        });
      }
    }
  }
  return errorsForResponse;
};

export const pipeSetup = (app: INestApplication) => {
  app.useGlobalPipes(
    new ObjectIdValidationTransformationPipe(),
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedError = pipeErrorFormatter(errors);
        throw new BadRequestException(formattedError);
      },
    }),
  );
};
