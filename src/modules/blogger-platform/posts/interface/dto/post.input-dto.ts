import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import {
  postContentConstraints,
  postDescriptionConstraints,
  postTitleConstraints,
} from '../../constants/posts-constants';
import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

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
  @IsInt()
  @IsNotEmpty()
  blogId: number;
}

export class PostInputDtoWithoutBlogId extends OmitType(PostInputDto, [
  'blogId',
] as const) {}
