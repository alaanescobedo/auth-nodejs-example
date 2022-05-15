import type { Request, Response } from "express"
import { db } from "../../setup/config"
import { AuthStorage, TokenStorage } from './storage'
import type { SignupClientData, SignupUserData } from "../../../../common/src/modules/auth/interfaces/auth.interfaces"
import type { LoginUserClientData } from "../../../../common/src/modules/auth/interfaces/login.interface"
import Token from './utils/token.service'
import AppError from "../error/errorApp"
import { catchAsync } from "../error/utils"
import { Encrypt } from "./utils"

const signup = catchAsync(async (req: Request, res: Response) => {
  const { username, email, password } = req.body as SignupClientData

  const passwordHashed = Encrypt.hash(password)
  const userToCreate: SignupUserData = {
    username,
    email,
    password: passwordHashed
  }

  db.connect()
  const user = await AuthStorage.createUser(userToCreate)

  const accessToken = Token.create({ data: user._id })
  const refreshToken = Token.createRefresh({ data: user._id, expiresIn: '1d' })
  const tokenStored = await TokenStorage.store({ token: refreshToken, user: user._id })

  user.refreshTokens = [tokenStored._id]
  await user.save()
  db.disconnect()

  user.password = ''

  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  })

  res.status(200).json({
    route: 'Signup route',
    status: 'success',
    token: accessToken,
    data: {
      user
    }
  })
})

const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginUserClientData
  const { jwt } = req.cookies

  db.connect()
  const user = await AuthStorage.findUserByEmail({ email })
  if (user === null) throw new AppError('User not found', 404)

  const match = Encrypt.compare(password, user?.password)
  if (!match) throw new AppError('Password is not valid', 401)

  const userInfo = {
    username: user.username,
  }


  const accessToken = Token.create({ data: userInfo })
  const newRefreshToken = Token.createRefresh({ data: user._id, expiresIn: '1d' })
  const tokenStored = await TokenStorage.store({ token: newRefreshToken, user: user._id })

  if (jwt) {
    const foundToken = await TokenStorage.findOne({ token: jwt })
    if (foundToken === null) {
      // clear out ALL previous refresh tokens
      user.refreshTokens = []
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })

    TokenStorage.destroy({ token: jwt })

    // If refresh token comes, replace it with new one
    user.refreshTokens = jwt
    ? user.refreshTokens.filter(tokenId => tokenId !== foundToken?._id)
    : user.refreshTokens
  }

  // Append new refresh token to user
  user.refreshTokens = [...user.refreshTokens, tokenStored._id]

  await user.save()
  db.disconnect()

  // Create secure cookie
  res.cookie('jwt', newRefreshToken, {
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  })

  // Send Response
  res.status(200).json({
    route: 'Login route',
    status: 'success',
    token: accessToken,
    data: {
      user
    }
  })
})

const logout = catchAsync(async (req: Request, res: Response) => {
  const { jwt: refreshToken } = req.cookies

  db.connect()
  const tokenData = await TokenStorage.findOne({ token: refreshToken })
  db.disconnect()

  if (tokenData === null) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true })
    return res.status(200).json({
      route: 'Logout route',
      status: 'No Content',
      data: null
    })
  }

  const { token } = tokenData
  await TokenStorage.destroy({ token })

  return res.status(200).json({
    message: 'Logout route',
  })
})

const refresh = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Refresh route',
  })
}

const forgotPassword = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Forgot password route',
  })
}

const resetPassword = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Reset password route',
  })
}

export default {
  signup,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword,
}