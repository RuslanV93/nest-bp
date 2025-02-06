import { PartialType } from '@nestjs/mapped-types';

export class CommentInputDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
}

export class CommentUpdateInputDto extends PartialType(CommentInputDto) {}
