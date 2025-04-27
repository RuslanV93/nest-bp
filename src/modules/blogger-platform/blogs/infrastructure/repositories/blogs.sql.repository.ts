// import { Injectable, NotFoundException } from '@nestjs/common';
// import {
//   BlogsSqlEntityType,
//   SqlDomainBlog,
// } from '../../domain/blogs.sql.domain';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
//
// @Injectable()
// export class BlogsSqlRepository {
//   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
//
//   async findOne(id: number) {
//     const blog: BlogsSqlEntityType[] = await this.dataSource.query(
//       `
//       SELECT * FROM "BLOGS"
//       WHERE "_id" = $1 AND "deletedAt" IS NULL
//     `,
//       [id.toString()],
//     );
//     if (!blog.length) {
//       return null;
//     }
//     return SqlDomainBlog.fromSqlResult(blog[0]);
//   }
//   async findOneOrNotFoundException(id: number) {
//     const blog = await this.findOne(id);
//     if (!blog) {
//       throw new NotFoundException('Blog not found.');
//     }
//     return blog;
//   }
//   async createBlog(blog: SqlDomainBlog): Promise<number> {
//     interface BlogInsertResult {
//       _id: string;
//     }
//     const blogInsertResult: BlogInsertResult[] = await this.dataSource.query(
//       `
//     INSERT INTO "BLOGS" (_id, name, description, "websiteUrl", "isMembership")
//     VALUES ($1, $2, $3, $4, $5)
//     RETURNING _id;
//     `,
//       [
//         blog._id,
//         blog.name,
//         blog.description,
//         blog.websiteUrl,
//         blog.isMembership,
//       ],
//     );
//     return blogInsertResult[0]._id;
//   }
//   async deleteBlog(blog: SqlDomainBlog) {
//     await this.dataSource.query(
//       `
//     UPDATE "BLOGS"
//     SET "deletedAt" = $1
//     WHERE "_id" = $2
//     `,
//       [blog.deletedAt, blog._id],
//     );
//   }
//   async updateBlog(blog: SqlDomainBlog) {
//     await this.dataSource.query(
//       `
//     UPDATE "BLOGS"
//     SET "name" = $1, "description" = $2, "websiteUrl" = $3
//     WHERE "_id" = $4
//     `,
//       [blog.name, blog.description, blog.websiteUrl, blog._id],
//     );
//   }
// }
