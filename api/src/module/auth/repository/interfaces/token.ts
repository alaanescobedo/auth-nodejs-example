import type { HydratedDocument, Model } from "mongoose"
import type { IUser } from "@common/auth/interfaces"

export interface ITokenData {
  token: string
  user: Pick<IUser, 'id'>
  agent: string
  readonly lastUsedAt: Date | null
  readonly createdAt: Date | null
}

export interface ITokenDoc extends HydratedDocument<ITokenData> { }
export interface ITokenModel extends Model<ITokenDoc> { }
