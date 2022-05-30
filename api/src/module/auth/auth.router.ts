import express from 'express'
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema
} from '@common/auth/validations'
import { connectionDB } from '@setup/config/middlewares/connection-db'
import { validateRequest } from '@utils'
import { authProtect } from '@auth/middlewares'
import AuthController from '@auth/controllers'
// import { UserAgentGuard } from '@auth/guards'

const router = express.Router()

// All the next routes will be connected to the database
router.use(connectionDB)

router
  .route('/signup')
  .post(validateRequest(signupSchema), AuthController.register)

router
  .route('/login')
  .post(
    validateRequest(loginSchema),
    AuthController.connect
  )

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