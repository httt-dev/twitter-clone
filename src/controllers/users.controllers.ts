import { NextFunction, Request, Response } from 'express'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.service'

export const loginController = (req: Request, res: Response) => {
  console.log(req.body)
  const { email, password } = req.body

  res.json({
    message: 'Login success'
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
    message: 'Register success',
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
