import type { IUserData } from '@user/repository/interfaces/user'
import { CRUDFactory } from 'module/helpers'
import { UserModel as UserRepository } from '../repository'
import type { IUserService } from './interfaces/user'

const UserService = (userRepository: typeof UserRepository = UserRepository): IUserService => {
  const factory = CRUDFactory<IUserData>(userRepository)

  return {
    ...factory,
    getOne: (query) => factory.getOne(query)
  } as IUserService
}

export { UserService }
export default UserService

