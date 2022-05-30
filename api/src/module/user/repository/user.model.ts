import mongoose, { Schema } from 'mongoose'
import { AuthService } from '@auth';
import type { IUserData } from './interfaces/user';
import { transformMongoId } from '@utils';

// Timestamps automatically add createdAt and updatedAt fields
const userSchema = new Schema<IUserData>({
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
    versionKey: false,
    transform: transformMongoId
  },
  toObject: {
    versionKey: false,
    transform: transformMongoId
  }
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) next()

  this.password = AuthService.cryptService.hash(this.password);
  next();
});

const UserModel = mongoose.models['User'] || mongoose.model('User', userSchema);
export { UserModel };
