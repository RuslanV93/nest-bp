// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Blog, BlogModelType } from '../../domain/blogs.model';
// import { GetBlogsQueryParams } from '../../interface/dto/get-blogs.query-params.input.dto';
// import { FilterQuery } from 'mongoose';
// import { BlogViewDto } from '../../interface/dto/blog.view-dto';
// import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
// import { ObjectId } from 'mongodb';
//
// @Injectable()
// export class BlogsQueryRepository {
//   constructor(@InjectModel(Blog.name) private blogModel: BlogModelType) {}
//   async getBlogs(query: GetBlogsQueryParams) {
//     const filter: FilterQuery<Blog> = { deletedAt: null };
//     if (query.searchNameTerm) {
//       filter.$or = filter.$or || [];
//       filter.$or.push({
//         name: { $regex: query.searchNameTerm, $options: 'i' },
//       });
//     }
//     const blogs = await this.blogModel
//       .find(filter)
//       .sort({
//         [query.sortBy]: query.sortDirection,
//       })
//       .skip(query.calculateSkipParam())
//       .limit(query.pageSize);
//     const totalCount: number = await this.blogModel.countDocuments(filter);
//     const items = blogs.map(BlogViewDto.mapToView);
//     return PaginatedViewDto.mapToView({
//       items,
//       page: query.pageNumber,
//       size: query.pageSize,
//       totalCount,
//     });
//   }
//
//   async getBlogById(id: ObjectId) {
//     const blog = await this.blogModel.findOne({
//       deletedAt: null,
//       _id: id,
//     });
//     if (!blog) {
//       throw new NotFoundException('Blog not found');
//     }
//     return BlogViewDto.mapToView(blog);
//   }
// }
