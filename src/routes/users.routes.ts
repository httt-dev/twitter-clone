import express from 'express'
import { loginValidator, registerValidator } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidator, loginController)

/**
 * path : /register
 * method : POST
 * Body : {name : string , email : string ,password: string, confirm_password: string, date_of_birth : ISO string }
 */
usersRouter.post('/register', registerValidator, registerController)
export default usersRouter
