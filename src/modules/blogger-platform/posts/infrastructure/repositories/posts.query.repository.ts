import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/posts.model';
import { FilterQuery } from 'mongoose';
import { GetPostsQueryParams } from '../../interface/dto/get-posts.query-params.input.dto';
import { ObjectId } from 'mongodb';
import { PostViewDto } from '../../interface/dto/post.view-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: PostModelType,
  ) {}

  async getPosts(query: GetPostsQueryParams, blogId?: string) {
    const baseFilter: FilterQuery<Post> = { deletedAt: null };
    const conditions: Array<FilterQuery<Post>> = [];

    if (blogId) {
      conditions.push({ blogId: new ObjectId(blogId) });
    }

    if (query.searchTitleTerm) {
      conditions.push({
        title: { $regex: query.searchTitleTerm, $options: 'i' },
      });
    }
    /** If conditions exists, add them to filter */
    const filter = conditions.length
      ? { ...baseFilter, $or: conditions }
      : baseFilter;

    const posts = await this.postModel
      .find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkipParam())
      .limit(query.pageSize);
    const totalCount = await this.postModel.countDocuments(filter);

    const items = posts.map(PostViewDto.mapToView);
    return PaginatedViewDto.mapToView({
      items,
      page: query.pageNumber,
      size: query.pageSize,
      totalCount,
    });
  }

  async getPostById(id: string) {
    const post = await this.postModel.findOne({
      deletedAt: null,
      _id: new ObjectId(id),
    });
    if (!post) {
      return null;
    }
    return PostViewDto.mapToView(post);
  }
}
