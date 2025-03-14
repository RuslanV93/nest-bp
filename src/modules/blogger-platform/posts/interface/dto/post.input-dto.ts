import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import {
  postContentConstraints,
  postDescriptionConstraints,
  postTitleConstraints,
} from '../../constants/posts-constants';
import { Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { BlogExistsValidator } from '../../../blogs/constants/blogs-constants';
import { IsObjectId } from '../../../../../core/decorators/validation/isObjectId';

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
  @Transform(
    ({ value }) => {
      if (!value) {
        return null;
      }

      return value;
    },
    { toClassOnly: true },
  )
  @Validate(BlogExistsValidator)
  @IsObjectId()
  @IsString()
  @IsNotEmpty()
  blogId: ObjectId;
}

export class PostInputDtoWithoutBlogId extends OmitType(PostInputDto, [
  'blogId',
] as const) {}
