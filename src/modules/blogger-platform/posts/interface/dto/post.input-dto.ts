import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import {
  postContentConstraints,
  postDescriptionConstraints,
  postTitleConstraints,
} from '../../constants/posts-constants';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class PostInputDto {
  @ApiProperty()
  @IsStringWithTrim(
    postTitleConstraints.minLength,
    postTitleConstraints.maxLength,
  )
  title: string;

  @ApiProperty()
  @IsStringWithTrim(
    postDescriptionConstraints.minLength,
    postDescriptionConstraints.maxLength,
  )
  shortDescription: string;

  @ApiProperty()
  @IsStringWithTrim(
    postContentConstraints.minLength,
    postContentConstraints.maxLength,
  )
  content: string;

  @ApiProperty()
  @Transform(({ value }: { value: string }) => {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return new ObjectId(value);
  })
  blogId: ObjectId;
}
