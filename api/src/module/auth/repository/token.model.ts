import mongoose, { type Document, Model, Schema } from 'mongoose'
import type { UserEntity } from '../../user/repository/user.model'

export interface IToken {
  token: string
  user: Pick<UserEntity, '_id'>
  agent: string
  lastUsedAt: Date
}

export type TokenWithUsername = TokenEntity & {
  user: Pick<UserEntity, 'username'>;
} | null

export interface TokenEntity extends IToken, Document { }

// Timestamps automatically add createdAt and updatedAt fields
const tokenSchema = new Schema<IToken>({
  token: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent: {
    type: String,
    required: true
  }
},
  {
    toJSON: {
      virtuals: true
    },
    timestamps: {
      updatedAt: 'lastUsedAt'
    }
  })

tokenSchema.pre<TokenEntity>(/^find/, function (next) {
  if (this === undefined) return next()
  this.populate({
    path: 'user',
    select: 'username'
  })
  next()
})

const TokenModel: Model<IToken> = mongoose.models['Token'] || mongoose.model('Token', tokenSchema);
export type ITokenModel = mongoose.Model<IToken, {}, {}, {}>

export { TokenModel };
