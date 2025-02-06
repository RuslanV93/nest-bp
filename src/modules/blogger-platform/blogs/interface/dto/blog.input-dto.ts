import { PartialType } from '@nestjs/mapped-types';

export class BlogInputDto {
  name: string;
  description: string;
  websiteUrl: string;
}

export class BlogUpdateInputDto extends PartialType(BlogInputDto) {}
