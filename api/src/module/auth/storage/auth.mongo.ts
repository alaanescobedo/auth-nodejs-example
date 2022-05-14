import type { IUser, SignupUserData } from "../../../../../common/src/modules/auth/interfaces/auth.interfaces"
import UserModel from "./auth.model"

const save = async ({ email, password, username }: SignupUserData): Promise<IUser> => {
  const user = await UserModel.create({ username, password, email })
  return user
}

export default {
  save
}