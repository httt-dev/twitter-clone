import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import usersService from '~/services/users.service'
import { validate } from '~/utils/validation'

// login middleware
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Misssing email or password'
    })
  }

  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true
    },

    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value: string) => {
          const isExisted = await usersService.isEmailExisted(value)
          if (isExisted) {
            throw new Error('Email already exists')
          }
          return isExisted
        }
      }
    },

    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      }
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: {
          min: 6,
          max: 50
        }
      },
      custom: {
        options: (value, { req }) => {
          ///
          if (value != req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
