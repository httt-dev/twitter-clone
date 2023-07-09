import { Request, Response, NextFunction, RequestHandler } from 'express'

export const wrapRequestHandler = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Promise.resolve(func(req, res, next)).catch(next) // khong dung duoc neu la ham khong phai async
    try {
      await func(req, res, next)
    } catch (err) {
      next(err)
    }
  }
}
