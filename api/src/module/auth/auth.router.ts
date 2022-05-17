import express from 'express'
import loginSchema from '../../../../common/src/modules/auth/validations/login.schema'
import resetPasswordSchema from '../../../../common/src/modules/auth/validations/reset-password.schema'
import signupSchema from '../../../../common/src/modules/auth/validations/signup.schema'
import validateRequest from '../../utils/validateRequest'
import AuthController from './controllers'
import { authProtect } from './utils/auth-protect.middleware'

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