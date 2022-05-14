import mongoose, { Model, Schema } from 'mongoose'
import type { IUser } from '../../../../../common/src/modules/auth/interfaces/auth.interfaces';

const userSchema = new Schema<IUser>({
  createdAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  updatedAt: {
    type: Date
  },
  
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
    select: false,
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
  }
}, {
  timestamps: true
})

const UserModel: Model<IUser> = mongoose.models['User'] || mongoose.model('User', userSchema);


export default UserModel;
