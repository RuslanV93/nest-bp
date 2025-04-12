import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeDislike } from '../../domain/like.orm.domain';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { LikeWhereType, ParentType } from '../../types/like.types';

@Injectable()
export class LikesOrmRepository {
  constructor(
    @InjectRepository(LikeDislike)
    private readonly likeRepository: Repository<LikeDislike>,
  ) {}
  async findLike(userId: ObjectId, parentId: ObjectId, parentType: ParentType) {
    const whereObj: LikeWhereType = {
      userId: userId.toString(),
      parent: parentType,
    };
    if (parentType === ParentType.COMMENT) {
      whereObj.commentId = parentId.toString();
    } else if (parentType === ParentType.POST) {
      whereObj.postId = parentId.toString();
    }
    const like = await this.likeRepository.findOne({
      where: whereObj,
    });
    if (!like) {
      return null;
    }
    return like;
  }
  async save(like: LikeDislike) {
    const newLike = await this.likeRepository.save(like);
    return newLike._id;
  }
  async createLike(like: LikeDislike) {
    const createdLike = this.likeRepository.create(like);
    const newLikeId = await this.save(createdLike);
    return new ObjectId(newLikeId);
  }
}
