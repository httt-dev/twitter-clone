import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import HTTP_STATUS from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/schemas/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await validation.run(req)
    const errors = validationResult(req)

    // truong hop khong co loi xay ra thi next tiep
    if (errors.isEmpty()) {
      return next()
    }
    // xu ly tron truong hop co loi
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })

    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      if (msg instanceof ErrorWithStatus && msg.status != HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        // loi khong phai la do validate
        return next(msg)
      }

      // la loi validation
      entityError.errors[key] = errorsObject[key]
    }
    // loi do validate
    next(entityError)
  }
}
