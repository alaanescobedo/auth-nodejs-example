import express from 'express'
import loginSchema from '../../../../common/src/modules/auth/validations/login.schema'
import resetPasswordSchema from '../../../../common/src/modules/auth/validations/reset-password.schema'
import signupSchema from '../../../../common/src/modules/auth/validations/signup.schema'
import validateRequest from '../../utils/validateRequest'
import AuthService from './auth.controller'
import { authProtect } from './utils/auth-protect.middleware'

const router = express.Router()

router
  .route('/signup')
  .post(validateRequest(signupSchema), AuthService.signup)

router
  .route('/login')
  .post(validateRequest(loginSchema), AuthService.login)

router
  .route('/logout')
  .post(AuthService.logout)

router
  .route('/refresh-token')
  .post(AuthService.refreshToken)

router
  .route('/forgot-password')
  .post(AuthService.forgotPassword)

router
  .use(authProtect)
  .route('/reset-password')
  .patch(validateRequest(resetPasswordSchema), AuthService.resetPassword)

export default router