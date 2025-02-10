import { ApiProperty } from '@nestjs/swagger';
import { IsStringWithTrim } from '../../../../../core/decorators/validation/isStringWithTrim';
import {
  blogDescriptionConstraints,
  blogNameConstraints,
  blogWebsiteUrlConstraints,
} from '../../constants/blogs-constants';
import { Matches } from 'class-validator';

export class BlogInputDto {
  @ApiProperty()
  @IsStringWithTrim(
    blogNameConstraints.minLength,
    blogNameConstraints.maxLength,
  )
  name: string;

  @ApiProperty()
  @IsStringWithTrim(
    blogDescriptionConstraints.minLength,
    blogDescriptionConstraints.maxLength,
  )
  description: string;
  @ApiProperty()
  @IsStringWithTrim(
    blogWebsiteUrlConstraints.minLength,
    blogWebsiteUrlConstraints.maxLength,
  )
  @Matches(blogWebsiteUrlConstraints.pattern)
  websiteUrl: string;
}
