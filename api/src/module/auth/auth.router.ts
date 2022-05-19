import express from 'express'
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema
} from '@common/auth/validations'
import AuthController from '@auth/controllers'
import { authProtect } from '@auth/utils'
import { validateRequest } from '@utils'

const router = express.Router()

router
  .route('/signup')
  .post(validateRequest(signupSchema), AuthController.register)

router
  .route('/login')
  .post(validateRequest(loginSchema), AuthController.connect)

router
  .route('/logout')
  .post(AuthController.disconnect)

router
  .route('/refresh-token')
  .post(AuthController.refreshToken)

router
  .route('/forgot-password')
  .post(AuthController.forgotPassword)

router
  .use(authProtect)
  .route('/reset-password/:token')
  .patch(validateRequest(resetPasswordSchema), AuthController.resetPassword)

export default router