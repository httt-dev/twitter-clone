import { NextFunction, Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.service'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGE } from '~/constants/messages'

export const loginController = async (req: Request, res: Response) => {
  const user: User = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())

  return res.json({
    message: USERS_MESSAGE.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  //   throw new Error('register error')
  const result = await usersService.register(req.body)

  return res.json({
    message: USERS_MESSAGE.REGISTER_SUCCESS,
    result
  })
  //   const { email, password } = req.body
  //   try {
  //     const result = await usersService.register(req.body)

  //     return res.json({
  //       message: 'Register success',
  //       result
  //     })
  //   } catch (error) {
  //     next(error)
  //     // return res.status(400).json({
  //     //   message: 'Register failed',
  //     //   error
  //     // })
  //   }
}
