import type { IUser } from "@common/auth/interfaces"
import { AppError } from "@error"
import { UserRepository, type UserEntity, type IUserModel } from "@user/repository"

interface IUserService {
  create({ ...user }: Partial<IUser>): Promise<UserEntity>
  getById({ id }: { id: string }): Promise<UserEntity>
  getOne({ ...query }: Partial<IUser>): Promise<UserEntity>
  findById({ id }: { id: string }): Promise<UserEntity | null>
  findOne({ ...query }: Partial<IUser>): Promise<UserEntity | null>
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

  async getById({ id }: { id: string }): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findById(id)
      if (user === null) throw new AppError("User not found", 404)
      return user
    } catch (error) {
      throw error
    }
  }
  async getOne({ ...query }: Partial<IUser>): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({ query })
      if (user === null) throw new AppError("User not found", 404)
      return user
    } catch (error) {
      throw error
    }
  }

  async findById({ id }: { id: string }): Promise<UserEntity | null> {
    const user = await this.userRepository.findById(id)
    return user
  }
  async findOne({ ...query }: Partial<IUser>): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ query })
    return user
  }

  async deleteOne({ ...query }: Partial<IUser>): Promise<void> {
    await this.userRepository.deleteOne({ query })
    return
  }
  async deleteMany({ ...query }: Partial<IUser>): Promise<void> {
    await this.userRepository.deleteMany({ query })
    return
  }
}

export default new UserService(UserRepository)