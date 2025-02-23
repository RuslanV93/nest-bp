import { ObjectId } from 'mongodb';

export class UserContextDto {
  id: ObjectId;
}

export type Nullable<T> = { [P in keyof T]: T[P] | null };
