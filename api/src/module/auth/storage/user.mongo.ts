import type { SignupUserData } from "../../../../../common/src/modules/auth/interfaces/auth.interfaces"
import UserModel, { UserEntity } from "./user.model"

const createUser = async ({ email, password, username }: SignupUserData): Promise<UserEntity> => {
  const user = await UserModel.create({ username, password, email })
  return user
}
const findUserByEmail = async ({ email }: { email: string }): Promise<UserEntity | null> => {
  const user = await UserModel.findOne({ email })
  return user
}
const findUserById = async ({ id }: { id: string }): Promise<UserEntity | null> => {
  const user = await UserModel.findById(id)
  return user
}
const updatePassword = async ({ id, password }: { id: string; password: string }): Promise<UserEntity | null> => {
  const user = await UserModel.findByIdAndUpdate(id, { password })
  return user
}

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updatePassword
}