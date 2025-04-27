// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Post, PostModelType } from '../../domain/posts.model';
// import { FilterQuery } from 'mongoose';
// import { GetPostsQueryParams } from '../../interface/dto/get-posts.query-params.input.dto';
// import { ObjectId } from 'mongodb';
// import { PostViewDto } from '../../interface/dto/post.view-dto';
// import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
// import { LikesQueryRepository } from '../../../likes/infrastructure/repositories/likes.query-repository';
// import {
//   PostLike,
//   PostLikeModelType,
// } from '../../../likes/domain/posts.likes.model';
//
// @Injectable()
// export class PostsQueryRepository {
//   constructor(
//     @InjectModel(Post.name) private readonly postModel: PostModelType,
//     @InjectModel(PostLike.name)
//     private readonly postLikeModel: PostLikeModelType,
//     private readonly likesQueryRepository: LikesQueryRepository,
//   ) {}
//
//   async getPosts(
//     query: GetPostsQueryParams,
//     blogId?: ObjectId,
//     userId?: ObjectId,
//   ) {
//     const baseFilter: FilterQuery<Post> = { deletedAt: null };
//     const conditions: Array<FilterQuery<Post>> = [];
//
//     if (blogId) {
//       conditions.push({ blogId: blogId });
//     }
//
//     if (query.searchTitleTerm) {
//       conditions.push({
//         title: { $regex: query.searchTitleTerm, $options: 'i' },
//       });
//     }
//     /** If conditions exists, add them to filter */
//     const filter = conditions.length
//       ? { ...baseFilter, $or: conditions }
//       : baseFilter;
//
//     const posts = await this.postModel
//       .find(filter)
//       .sort({ [query.sortBy]: query.sortDirection })
//       .skip(query.calculateSkipParam())
//       .limit(query.pageSize);
//     const postIds = posts.map((post) => post._id);
//
//     const [totalCount, likesInfo, newestLikes] = await Promise.all([
//       await this.postModel.countDocuments(filter),
//       await this.likesQueryRepository.getLikeStatusesForPosts(postIds, userId),
//       await this.likesQueryRepository.getPostsNewestLikes(postIds),
//     ]);
//     const items = posts.map((post) => {
//       const postLikes =
//         likesInfo?.filter(
//           (like) => like.parentId.toString() === post._id.toString(),
//         ) ?? null;
//       return PostViewDto.mapToView(post, postLikes, newestLikes);
//     });
//     return PaginatedViewDto.mapToView({
//       items,
//       page: query.pageNumber,
//       size: query.pageSize,
//       totalCount,
//     });
//   }
//
//   async getPostById(id: ObjectId, userId?: ObjectId | null) {
//     const post = await this.postModel.findOne({
//       deletedAt: null,
//       _id: id,
//     });
//
//     if (!post) {
//       return null;
//     }
//     const [likeInfo, newestLikes] = await Promise.all([
//       await this.likesQueryRepository.getPostLikeStatus(
//         this.postLikeModel,
//         id,
//         userId,
//       ),
//       await this.likesQueryRepository.getPostsNewestLikes([id]),
//     ]);
//
//     return PostViewDto.mapToView(post, likeInfo, newestLikes);
//   }
// }
