import type { ITokenData } from "@auth/repository/interfaces"
import type { CRUDFactoryMethods } from "module/helpers/handlerFactory.mongo"
import type { SignJWT } from "./crypt"

type RenamedKeys = 'deleteOne' | 'deleteMany' // To revoke and revokeAll

export interface ITokenService extends Omit<CRUDFactoryMethods<ITokenData>, RenamedKeys> {
  revoke: Pick<CRUDFactoryMethods<ITokenData>, 'deleteOne'>['deleteOne']
  revokeAll: Pick<CRUDFactoryMethods<ITokenData>, 'deleteMany'>['deleteMany']
}

export interface RefreshTokenData {
  tokenData: Pick<ITokenData, 'user' | 'agent'>
  cookieName: 'rt'
  access_token: Omit<SignJWT, 'refresh'>
  refresh_token?: Omit<SignJWT, 'refresh'>
}
