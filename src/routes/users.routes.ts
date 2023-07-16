import express from 'express'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator
} from '../middlewares/users.middlewares'
import {
  verifyEmailController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendVerifyEmailController,
  forgotPasswordController,
  verifyForgotPasswordController,
  resetPasswordController,
  getMeController
} from '../controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = express.Router()

/**
 * path : /login
 * method : POST
 * Body : { email : string ,password: string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * path : /register
 * method : POST
 * Body : {name : string , email : string ,password: string, confirm_password: string, date_of_birth : ISO string }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * path : /logout
 * method : POST
 * Headers : {Authorization : Bearer <access_token>}
 * Body : { refresh_token : string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * path : /refresh-token
 * method : POST
 * Body : { refresh_token : string}
 */
usersRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * path : /verify-email
 * method : POST
 * Body : { email_verify_token : string}
 */
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * path : /resend-verify-email
 * method : POST
 * Headers : {Authorization : Bearer <access_token>}
 * Body : {}
 */
usersRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

/**
 * path : /forgot-password
 * method : POST
 * Body : {email : string }
 */
usersRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * description : verify forgot password token
 * path : /verify-forgot-password
 * method : POST
 * Body : {forgot_password_token : string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * description : reset password
 * path : /reset-password
 * method : POST
 * Body : {forgot_password_token : string  , password : string , confirm_password : string}
 */
usersRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * description : get profile  information
 * path : /me
 * method : GET
 * Headers : {Authorization : Bearer <access_token>}
 * Body : {}
 */
usersRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeController))

export default usersRouter
