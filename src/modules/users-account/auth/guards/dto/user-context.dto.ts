import { ObjectId } from 'mongodb';

export class UserContextDto {
  id: ObjectId;
}

export class UserRefreshContextDto extends UserContextDto {
  exp: string;
}

export type Nullable<T> = { [P in keyof T]: T[P] | null };
