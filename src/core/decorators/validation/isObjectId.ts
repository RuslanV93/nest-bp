import { registerDecorator, ValidationArguments } from 'class-validator';
import { isValidObjectId } from 'mongoose';

export function IsObjectId() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(value: any) {
          return isValidObjectId(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ObjectId`;
        },
      },
    });
  };
}
