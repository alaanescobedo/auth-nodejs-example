import mongoose, { type   Document, Model, Schema } from 'mongoose'

export interface IToken {
  token: string
  user: string
  lastUsedAt: Date
}

export interface TokenEntity extends IToken, Document {}

const tokenSchema = new Schema<IToken>({
  token:{
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  lastUsedAt:{
    type: Date,
    default: Date.now,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},
{
  toJSON: { virtuals: true }
})
const TokenModel: Model<IToken> = mongoose.models['Token'] || mongoose.model('Token', tokenSchema);


export default TokenModel;
