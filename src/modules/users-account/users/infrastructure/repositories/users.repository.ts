import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument, UserModelType } from '../../domain/users.model';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: UserModelType) {}
  async findById(id: ObjectId): Promise<UserDocument | null> {
    return this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }
  async save(user: UserDocument): Promise<ObjectId> {
    const newUser: UserDocument = await user.save();
    return newUser._id;
  }
  async findOrNotFoundException(id: ObjectId): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not Found');
    }
    return user;
  }
}
