import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';

type idError = {
  message: string;
  field: string;
};
export class ObjectIdValidationTransformationPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata): any {
    if (metadata.type !== 'param') {
      return value;
    }
    const formattedError: idError[] = [];
    if (!isValidObjectId(value)) {
      formattedError.push({
        message: `Id is not a valid objectId.`,
        field: 'field',
      });
      throw new BadRequestException(formattedError);
    }
    return new ObjectId(value);
  }
}
