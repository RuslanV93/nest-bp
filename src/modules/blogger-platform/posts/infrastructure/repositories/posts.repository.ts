// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post, PostDocument, PostModelType } from '../../domain/posts.model';
// import { ObjectId } from 'mongodb';
//
// @Injectable()
// export class PostsRepository {
//   constructor(
//     @InjectModel(Post.name) private readonly postModel: PostModelType,
//   ) {}
//   async findOne(id: ObjectId) {
//     return this.postModel.findOne({
//       deletedAt: null,
//       _id: id,
//     });
//   }
//   async findOneAndNotFoundException(id: ObjectId): Promise<PostDocument> {
//     const post = await this.findOne(id);
//     if (!post) {
//       throw new NotFoundException('Post not Found.');
//     }
//     return post;
//   }
//   async save(post: PostDocument) {
//     const newPost = await post.save();
//     return newPost._id;
//   }
// }
