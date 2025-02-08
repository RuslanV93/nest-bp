import { BlogDocument } from '../../domain/blogs.model';
import { ApiProperty } from '@nestjs/swagger';

export class BlogViewDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() websiteUrl: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() isMembership: boolean;

  public static mapToView(this: void, blog: BlogDocument) {
    const dto = new BlogViewDto();
    dto.id = blog._id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.websiteUrl = blog.websiteUrl;
    dto.createdAt = blog.createdAt.toISOString();
    dto.isMembership = blog.isMembership;
    return dto;
  }
}
