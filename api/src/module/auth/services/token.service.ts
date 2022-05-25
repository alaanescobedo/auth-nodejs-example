import type { ITokenData } from '@auth/repository/interfaces'
import { CRUDFactory } from 'module/helpers'
import { TokenModel } from '../repository'
import type { ITokenService } from "./interfaces"

const TokenService = (repository: typeof TokenModel = TokenModel): ITokenService => {
  const { deleteMany, deleteOne, ...factory } = CRUDFactory<ITokenData>(repository)

  return {
    ...factory,
    //Rename methods
    revoke: async (query) => await deleteOne(query),
    revokeAll: async (query) => await deleteMany(query)
  }
}

export { TokenService }
export default TokenService

