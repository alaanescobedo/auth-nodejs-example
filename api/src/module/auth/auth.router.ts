import express from 'express'
import signupSchema from '../../../../common/src/modules/auth/validations/signup.schema'
import validateRequest from '../../utils/validateRequest'
import AuthService from './auth.controller'

const router = express.Router()

router
  .route('/signup')
  .post(validateRequest(signupSchema), AuthService.signup)

router
  .route('/login')
  .post(AuthService.login)

router
  .route('/logout')
  .post(AuthService.logout)

router
  .route('/refresh')
  .post(AuthService.refresh)

router
  .route('/forgotPassword')
  .post(AuthService.forgotPassword)

export default router