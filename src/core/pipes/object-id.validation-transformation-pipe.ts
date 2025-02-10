import { BadRequestException, PipeTransform } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';

export class ObjectIdValidationTransformationPipe implements PipeTransform {
  transform(value: string): any {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`Id is not a valid objectId.`);
    }
    return new ObjectId(value);
  }
}
