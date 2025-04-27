// import {
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
// } from '@nestjs/common';
// import { Post, PostModelType } from '../domain/posts.model';
// import { InjectModel } from '@nestjs/mongoose';
// import {
//   PostInputDto,
//   PostInputDtoWithoutBlogId,
// } from '../interface/dto/post.input-dto';
// import { ObjectId } from 'mongodb';
// import { SqlDomainPost } from '../domain/posts.sql.domain';
// import { PostsSqlRepository } from '../infrastructure/repositories/posts.sql.repository';
// import { BlogsSqlRepository } from '../../blogs/infrastructure/repositories/blogs.sql.repository';
//
// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectModel(Post.name) private readonly postModel: PostModelType,
//     private readonly postsRepository: PostsSqlRepository,
//     private readonly blogRepository: BlogsSqlRepository,
//   ) {}
//   /** Creates new Post. Returns new post id. */
//   async createPost(
//     blogId: ObjectId,
//     newPostDto: PostInputDto | PostInputDtoWithoutBlogId,
//   ) {
//     const existingBlog =
//       await this.blogRepository.findOneOrNotFoundException(blogId);
//     if (!existingBlog) {
//       throw new NotFoundException('Blog does not exist');
//     }
//
//     const post = SqlDomainPost.createInstance(newPostDto, blogId);
//     const newPostId = await this.postsRepository.createPost(post);
//
//     if (!newPostId) {
//       throw new InternalServerErrorException('Something went wrong');
//     }
//
//     return newPostId;
//   }
//
//   /** Update existing post fields */
//   async updatePost(id: ObjectId, updatePostDto: PostInputDto) {
//     const post: SqlDomainPost =
//       await this.postsRepository.findOneOrNotFoundException(id);
//     post.updatePost(updatePostDto);
//     await this.postsRepository.updatePost(post);
//   }
//   /** Delete post by post id */
//   async deletePost(id: ObjectId) {
//     const post = await this.postsRepository.findOneOrNotFoundException(id);
//     post.deletePost();
//     await this.postsRepository.deletePost(post);
//   }
// }
