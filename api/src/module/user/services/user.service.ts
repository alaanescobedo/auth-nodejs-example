import type { IUser } from "@common/auth/interfaces"
import { UserRepository, type UserEntity, type IUserModel } from "@user/repository"

interface IUserService {
  create({ ...user }: Partial<IUser>): Promise<UserEntity>
  findOne({ ...query }: Partial<IUser>): Promise<UserEntity | null>
  findById({ id }: { id: string }): Promise<UserEntity | null>
  deleteOne({ ...query }: Partial<IUser>): Promise<void>
  deleteMany({ ...query }: Partial<IUser>): Promise<void>
}

class UserService implements IUserService {
  private userRepository: IUserModel
  constructor(userRepository: IUserModel) {
    this.userRepository = userRepository
  }

  async create({ ...user }: Partial<IUser>): Promise<UserEntity> {
    return await this.userRepository.create({ ...user })
  }
  async findById({ id }: { id: string }) {
    return await this.userRepository.findById({ id })
  }

  async findOne({ ...query }: any) {
    return await this.userRepository.findOne({ query })
  }

  async deleteOne({ ...query }: any) {
    await this.userRepository.deleteOne({ query })
    return
  }

  async deleteMany({ ...query }: any) {
    await this.userRepository.deleteMany({ query })
    return
  }
}

export default new UserService(UserRepository)