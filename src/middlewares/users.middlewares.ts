import { Request, Response, NextFunction } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/schemas/Errors'
import databaseServices from '~/services/database.services'
import usersService from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
// login middleware
// export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
//   const { email, password } = req.body
//   if (!email || !password) {
//     return res.status(400).json({
//       error: 'Misssing email or password'
//     })
//   }

//   next()
// }

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
  },
  isString: { errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_A_STRING },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_FROM_6_TO_50
  }
  //   isStrongPassword: {
  //     options: {
  //       minLength: 6,
  //       minLowercase: 1,
  //       minUppercase: 1,
  //       minNumbers: 1,
  //       minSymbols: 1
  //     },
  //     errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
  //   }
}
const confirmPasswordSchema: ParamSchema = {
  notEmpty: { errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_IS_REQUIRED },
  isString: { errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_A_STRING },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_FROM_6_TO_50
  },
  //   isStrongPassword: {
  //     options: {
  //       minLength: 6,
  //       minLowercase: 1,
  //       minUppercase: 1,
  //       minNumbers: 1,
  //       minSymbols: 1
  //     },
  //     errorMessage: USERS_MESSAGE.CONFIRM_PASSWORD_MUST_BE_STRONG
  //   },
  custom: {
    options: (value, { req }) => {
      ///
      if (value != req.body.password) {
        throw new Error(USERS_MESSAGE.CONFIRM_PASSWORD_MUST_MATCH)
      }
      return true
    }
  }
}

const forgotPasswordTokenSchema: ParamSchema = {
  trim: true,
  custom: {
    options: async (value: string, { req }) => {
      if (!value) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGE.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
          status: HTTP_STATUS.UNAUTHORIZED
        })
      }
      // verify password token
      try {
        const decoded_forgot_password_token = await verifyToken({
          token: value,
          secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
        })
        const { user_id } = decoded_forgot_password_token

        const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })

        if (user === null) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGE.USER_NOT_FOUND,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        if (user.forgot_password_token !== value) {
          throw new ErrorWithStatus({
            message: USERS_MESSAGE.INVALID_FORGOT_PASSWORD_TOKEN,
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        //ok
        req.decoded_forgot_password_token = decoded_forgot_password_token
        return true
      } catch (error) {
        if (error instanceof JsonWebTokenError) {
          throw new ErrorWithStatus({
            message: capitalize(error.message),
            status: HTTP_STATUS.UNAUTHORIZED
          })
        }
        throw error
      }
    }
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        //   notEmpty: {
        //     errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
        //   },
        isEmail: { errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseServices.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })

            if (user == null) {
              throw new Error(USERS_MESSAGE.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },

      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGE.PASSWORD_IS_REQUIRED
        },
        isString: { errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_A_STRING },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_FROM_6_TO_50
        }
        //   isStrongPassword: {
        //     options: {
        //       minLength: 6,
        //       minLowercase: 1,
        //       minUppercase: 1,
        //       minNumbers: 1,
        //       minSymbols: 1
        //     },
        //     errorMessage: USERS_MESSAGE.PASSWORD_MUST_BE_STRONG
        //   }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: {
        errorMessage: USERS_MESSAGE.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USERS_MESSAGE.NAME_MUST_BE_A_STRING
      },
      isLength: {
        options: {
          min: 1,
          max: 100
        },
        errorMessage: USERS_MESSAGE.NAME_MUST_BE_FROM_1_TO_100
      },
      trim: true
    },

    email: {
      //   notEmpty: {
      //     errorMessage: USERS_MESSAGE.EMAIL_IS_REQUIRED
      //   },
      isEmail: { errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID },
      trim: true,
      custom: {
        options: async (value: string) => {
          const isExisted = await usersService.isEmailExisted(value)
          console.log(isExisted)
          if (isExisted) {
            throw new Error(USERS_MESSAGE.EMAIL_ALREADY_EXISTS)
          }
          return isExisted
        }
      }
    },

    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        },
        errorMessage: USERS_MESSAGE.DATE_OF_BIRTH_MUST_BE_ISO_8601
      }
    }
  })
)

export const accessTokenValidator = validate(
  checkSchema({
    Authorization: {
      //   notEmpty: {
      //     errorMessage: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED
      //   },
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          const access_token = (value || '').split(' ')[1] //Bearer token
          if (!access_token) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          try {
            const decoded_authorization = await verifyToken({
              token: access_token,
              secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
            })
            ;(req as Request).decoded_authorization = decoded_authorization
          } catch (err) {
            throw new ErrorWithStatus({
              message: capitalize((err as JsonWebTokenError).message),
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          return true
        }
      }
    }
  })
)

export const refreshTokenValidator = validate(
  checkSchema({
    refresh_token: {
      //   notEmpty: {
      //     errorMessage: USERS_MESSAGE.REFRESH_TOKEN_IS_REQUIRED
      //   },
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGE.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          try {
            const [decoded_refresh_token, refresh_token] = await Promise.all([
              verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),

              // check if the refresh token exists in the database
              databaseServices.refreshTokens.findOne({ token: value })
            ])

            if (refresh_token === null) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGE.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            ;(req as Request).decoded_refresh_token = decoded_refresh_token
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: capitalize(error.message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            throw error
          }

          return true
        }
      }
    }
  })
)

export const emailVerifyTokenValidator = validate(
  checkSchema({
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value: string, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              message: USERS_MESSAGE.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          try {
            const decoded_email_verify_token = await verifyToken({
              token: value,
              secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
            })

            ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
          } catch (error) {
            if (error instanceof JsonWebTokenError) {
              throw new ErrorWithStatus({
                message: capitalize(error.message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            throw error
          }

          return true
        }
      }
    }
  })
)

export const forgotPasswordValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: { errorMessage: USERS_MESSAGE.EMAIL_IS_INVALID },
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const user = await databaseServices.users.findOne({
              email: value
            })

            if (user === null) {
              throw new Error(USERS_MESSAGE.USER_NOT_FOUND)
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: forgotPasswordTokenSchema
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema({
    password: passwordSchema,
    confirm_password: confirmPasswordSchema,
    forgot_password_token: forgotPasswordTokenSchema
  })
)
