import User from './models/schemas/User.schema'
import { Request } from 'express'

// mo rong them thuoc tinh user cho express
declare module 'express' {
  interface Request {
    user?: User
  }
}
