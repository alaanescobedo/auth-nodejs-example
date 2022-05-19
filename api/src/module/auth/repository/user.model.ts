import mongoose, { type Document, Model, Schema } from 'mongoose'
import type { IUser } from '@common/auth/interfaces';

export interface UserEntity extends IUser, Document { }

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 5
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 5,
    maxlength: 18
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
    select: false
  },
  verified: {
    type: Boolean,
    default: false,
    required: true,
    select: false
  }
}, {
  timestamps: true
})

userSchema.virtual('tokens', {
  ref: 'Token',
  foreignField: 'user',
  localField: '_id'
})


const UserModel: Model<IUser> = mongoose.models['User'] || mongoose.model('User', userSchema);

export { UserModel };
