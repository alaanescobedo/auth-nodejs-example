import { UserModel } from '../repository'
import type { IUserData } from '@user/repository/interfaces/user'
import { CRUDFactory } from 'module/helpers'
import type { IUserService } from './interfaces/user'

const UserService = (repository: typeof UserModel = UserModel): IUserService => {
  const { ...factory } = CRUDFactory<IUserData>(repository)

  return {
    ...factory
  }
}
export { UserService }
export default UserService

