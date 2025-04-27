// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectDataSource } from '@nestjs/typeorm';
// import { DataSource } from 'typeorm';
// import { ObjectId } from 'mongodb';
//
// @Injectable()
// export class PostsSqlRepository {
//   constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
//
//   async findOne(id: ObjectId) {
//     const posts: PostSqlDtoType[] = await this.dataSource.query(
//       `
//     SELECT * FROM "POSTS"
//     WHERE "_id" = $1 AND "deletedAt" IS NULL
//     `,
//       [id.toString()],
//     );
//     if (!posts.length) {
//       return null;
//     }
//     return SqlDomainPost.fromSqlResult(posts[0]);
//   }
//   async findOneOrNotFoundException(id: ObjectId) {
//     const post = await this.findOne(id);
//     if (!post) {
//       throw new NotFoundException('Post not found');
//     }
//     return post;
//   }
//
//   async createPost(post: SqlDomainPost) {
//     interface PostInsertResult {
//       _id: string;
//     }
//     const postInsertResult: PostInsertResult[] = await this.dataSource.query(
//       `
//       INSERT INTO "POSTS"
//       (_id, title, "shortDescription", content, "blogId")
//       VALUES ($1, $2, $3, $4, $5)
//       RETURNING _id;
//     `,
//       [post._id, post.title, post.shortDescription, post.content, post.blogId],
//     );
//     return new ObjectId(postInsertResult[0]._id);
//   }
//
//   async deletePost(post: SqlDomainPost) {
//     await this.dataSource.query(
//       `
//     UPDATE "POSTS"
//     SET "deletedAt" = $1 WHERE "_id" = $2
//     `,
//       [post.deletedAt, post._id],
//     );
//   }
//   async updatePost(post: SqlDomainPost) {
//     await this.dataSource.query(
//       `
//     UPDATE "POSTS"
//     SET "title" = $1, "shortDescription" = $2, "content" = $3
//     WHERE "_id" = $4
//     `,
//       [post.title, post.shortDescription, post.content, post._id],
//     );
//   }
// }
