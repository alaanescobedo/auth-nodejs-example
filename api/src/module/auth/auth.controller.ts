import type { Request, Response } from "express"
import { db } from "../../setup/config"
import AuthStorage from './storage'
import type { SignupClientData, SignupUserData } from "../../../../common/src/modules/auth/interfaces/auth.interfaces"
import AppError from "../error/errorApp"
import { hashPassword } from "./utils"

const signup = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body as SignupClientData
  if (password !== confirmPassword) throw new AppError('Password and confirm password do not match', 400)

  const passwordHashed = hashPassword(password)
  const userCreated: SignupUserData = {
    username,
    email,
    password: passwordHashed
  }

  db.connect()
  const user = await AuthStorage.save(userCreated)
  db.disconnect()


  user.password = ''

  res.status(200).json({
    message: 'Signup route',
    user
  })
}

const login = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Login route',
  })
}

const logout = async (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Logout route',
  })
}

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