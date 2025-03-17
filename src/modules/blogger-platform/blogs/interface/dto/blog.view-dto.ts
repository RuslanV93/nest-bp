import { BlogDocument } from '../../domain/blogs.model';
import { ApiProperty } from '@nestjs/swagger';
import { BlogsFromSql } from '../../infrastructure/repositories/blogs.sql.query-repository';

export class BlogViewDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string;
  @ApiProperty() websiteUrl: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() isMembership: boolean;

  public static mapToView(this: void, blog: BlogDocument | BlogsFromSql) {
    const dto = new BlogViewDto();
    dto.id = typeof blog._id === 'string' ? blog._id : blog._id.toString();
    dto.name = blog.name;
    dto.description = blog.description;
    dto.websiteUrl = blog.websiteUrl;
    dto.createdAt = blog.createdAt.toISOString();
    dto.isMembership = blog.isMembership;
    return dto;
  }
}
