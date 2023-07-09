import express from 'express'
import { loginValidator, registerValidator } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * path : /register
 * method : POST
 * Body : {name : string , email : string ,password: string, confirm_password: string, date_of_birth : ISO string }
 */
usersRouter.post('/register', registerValidator, wrapRequestHandler(registerController))
export default usersRouter
