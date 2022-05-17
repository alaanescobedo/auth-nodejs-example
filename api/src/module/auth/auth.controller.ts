import type { Request, Response } from "express"
import { db } from "../../setup/config"
import { AuthStorage, TokenStorage } from './storage'
import type { SignupClientData } from "../../../../common/src/modules/auth/interfaces/auth.interfaces"
import type { LoginUserClientData } from "../../../../common/src/modules/auth/interfaces/login.interface"
import AppError from "../error/errorApp"
import { catchError } from "../error/utils"
import { Encrypt, Token } from "./services"
import { secureTokens } from "./helpers/secure-token"
import { EmailService } from "../notifier/email"
import cookieService from "./services/cookie.service"

const signup = catchError(async (req: Request, res: Response) => {
  const { username, email, password } = req.body as SignupClientData

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  db.connect()
  const user = await AuthStorage.createUser({
    username,
    email,
    password: Encrypt.hash(password)
  })

  const { newAccessToken, response } = await secureTokens(res, {
    at: { data: user._id },
    user: user._id,
    agent: userAgent,
    cookie: 'rt'
  })
  db.disconnect()

  await EmailService.send({
    template: 'welcome',
    user: { username, email },
    token: newAccessToken
  })

  response.status(200).json({
    status: 'success',
    token: newAccessToken,
  })
})

const login = catchError(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginUserClientData
  const { rt: refreshToken } = req.cookies

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  db.connect()
  const user = await AuthStorage.findUserByEmail({ email })
  if (user === null) throw new AppError('User not found', 404)

  const match = Encrypt.compare(password, user.password)
  if (!match) throw new AppError('Password is not valid', 401)

  if (refreshToken) {
    const tokenData = await TokenStorage.findOne({ token: refreshToken })

    if (tokenData === null) {
      // Possibly the token has been stolen
      // Clear all refresh tokens for this user
      await TokenStorage.destroyAll({ user: user._id })
      throw new AppError('No Content - Refresh token not found', 400)
    }

    await TokenStorage.destroy({ token: refreshToken })
    res = cookieService.clear(res, { cookie: 'rt' })
  }
  if (!refreshToken) {
    const tokenOfUserAgent = await TokenStorage.findOne({ user: user._id, agent: userAgent })
    if (tokenOfUserAgent) await TokenStorage.destroy({ token: tokenOfUserAgent.token })
  }

  // TODO: Duplicate code - move to a helper
  const atData = {
    username: user.username,
    roles: null
  }
  // TODO: END TODO

  const { newAccessToken, response } = await secureTokens(res, {
    at: { data: atData },
    user: user._id,
    agent: userAgent,
    cookie: 'rt'
  })

  db.disconnect()

  // Send Response
  response.status(200).json({
    status: 'success',
    token: newAccessToken
  })
})

const logout = catchError(async (req: Request, res: Response) => {
  const { rt: refreshToken } = req.cookies

  db.connect()
  const tokenData = await TokenStorage.findOne({ token: refreshToken })
  db.disconnect()
  if (tokenData === null) throw new AppError('No Content', 404)

  const response = cookieService.clear(res, { cookie: 'rt' })
  await TokenStorage.destroy({ token: refreshToken })

  return response.status(200).json({})
})

const refreshToken = catchError(async (req: Request, res: Response) => {
  const { rt: refreshToken } = req.cookies
  if (refreshToken === undefined) throw new AppError('No refresh token', 401)
  res = cookieService.clear(res, { cookie: 'rt' })

  db.connect()
  const tokenData = await TokenStorage.findOne({ token: refreshToken })
  // ?DEBUG console.log({ tokenData })
  if (tokenData === null) {
    const decoded = Token.verify({ token: refreshToken, refresh: true }) as { data: string }
    // The token does not belong to any user
    //  Possibly invented token
    if (decoded === null) throw new AppError('No Content', 404)
    // ?DEBUG console.log({ decoded })
    // Possibly the token has been stolen
    // Clear all refresh tokens for this user
    const userHacked = await AuthStorage.findUserById({ id: decoded?.data }) // TODO: Only return the user-id, no all the user-data
    // ?DEBUG console.log({ userHacked })
    if (userHacked) {
      // User also should clear cookies in client
      await TokenStorage.destroyAll({ user: userHacked._id })
      //Todo Notify User of attempted hack
      // Send email to user
    }
    throw new AppError('No Content', 404)
  }
  const { user } = tokenData
  await TokenStorage.destroy({ token: refreshToken })

  // TODO: Duplicate code - move to a helper
  const atData = {
    username: user.username,
    roles: null
  }

  // TODO: END TODO
  const { newAccessToken, response } = await secureTokens(res, {
    at: { data: atData },
    user: user._id,
    agent: tokenData.agent,
    cookie: 'rt'
  })

  db.disconnect()

  response.status(200).json({
    status: 'success',
    token: newAccessToken,
  })
})

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  db.connect()
  const user = await AuthStorage.findUserByEmail({ email })
  if (user === null) throw new AppError('User not found', 404)

  const { newAccessToken, response } = await secureTokens(res, {
    user: user._id,
    at: { data: user._id, expiresIn: '1h' },
    cookie: 'rt',
    agent: userAgent
  })

  db.disconnect()

  const { username, email: useremail } = user

  await EmailService.send({
    template: 'forgotPassword',
    user: { username, email: useremail },
    token: newAccessToken
  })

  response.status(200).json({
    message: 'send email',
  })
}

const resetPassword = async (req: Request, res: Response) => {
  const { password } = req.body as { password: string }
  const data = req.locals.accessToken?.data

  // TODO MIDDLEWARE: Validate user agent
  const { "user-agent": userAgent } = req.headers
  if (!userAgent) throw new AppError('User agent is required for this operation', 400)
  // TODO: END TODO

  const userUpdated = await AuthStorage.updatePassword({ id: data, password: Encrypt.hash(password) })
  if (userUpdated === null) throw new AppError('User not found', 404)

  const { newAccessToken, response } = await secureTokens(res, {
    user: userUpdated._id,
    at: { data: userUpdated._id },
    agent: userAgent,
    cookie: 'rt'
  })

  const { username, email } = userUpdated

  await EmailService.send({
    template: 'resetPassword',
    user: { username, email },
    token: newAccessToken
  })

  response.status(200).json({
    message: 'Reset password route',
  })
}

export default {
  signup,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
}