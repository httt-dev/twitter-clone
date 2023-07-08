import express from 'express'
import { loginValidator } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidator, loginController)

usersRouter.post('/register', registerController)
export default usersRouter
