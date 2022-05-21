import mongoose, { type Document, Model, Schema } from 'mongoose'
import type { IUser } from '@common/auth/interfaces';
import { EncryptService } from '@auth/services';

export interface UserEntity extends IUser, Document {
  id: string
}

// Timestamps automatically add createdAt and updatedAt fields
export const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [5, 'email must be at least 5 characters'],
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'password must be at least 8 characters'],
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
  timestamps: true,
  toJSON: {
    versionKey: false
  },
  toObject: {
    versionKey: false
  }
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) next()

  this.password = EncryptService.hash(this.password);
  next();
});

const UserModel: Model<IUser> = mongoose.models['User'] || mongoose.model('User', userSchema);
export type IUserModel = mongoose.Model<IUser, {}, {}, {}>

export { UserModel };
