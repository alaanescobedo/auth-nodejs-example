import type { HydratedDocument, Model } from "mongoose"

export interface IUserData {
  email: string
  password: string
  username: string
  active: boolean
  verified: boolean
  readonly createdAt: Date
  readonly updatedAt: Date
}
export interface IUserDoc extends HydratedDocument<IUserData> { }
export interface IUserModel extends Model<IUserDoc> { }
