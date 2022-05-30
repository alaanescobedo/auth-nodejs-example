import type jwt from 'jsonwebtoken'

export interface SignJWT {
  data: any
  refresh?: boolean
  options?: jwt.SignOptions | undefined
}
export interface VerifyJWT {
  token: string
  refresh?: boolean
  options?: jwt.VerifyOptions
}
export interface ICryptService {
  hash: (item: string, rounds?: number) => string
  compare: (plainPassword: string, hashedPassword: string) => Promise<boolean>
  verify: ({ token, refresh, options }: VerifyJWT) => any
  sign: ({ data, refresh, options }: SignJWT) => string
}