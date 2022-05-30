import mongoose, { type Document, Schema } from 'mongoose'
import { transformMongoId } from '@utils';
import type { ITokenData } from './interfaces';

// Timestamps automatically add createdAt and updatedAt fields
const tokenSchema = new Schema<ITokenData>({
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
      versionKey: false,
      virtuals: true,
      transform: transformMongoId
    },
    toObject: {
      versionKey: false,
      virtuals: true,
      transform: transformMongoId
    },
    timestamps: {
      updatedAt: 'lastUsedAt'
    }
  })

tokenSchema.pre<Document>(/^find/, function (next) {
  if (this === undefined) return next()
  this.populate({
    path: 'user',
    select: 'username'
  })
  next()
})

const TokenModel = mongoose.models['Token'] || mongoose.model('Token', tokenSchema);

export { TokenModel };
