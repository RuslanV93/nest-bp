import { PartialType } from '@nestjs/mapped-types';

export class PostInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class PostUpdateInputDto extends PartialType(PostInputDto) {}
