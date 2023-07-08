import { Request, Response, NextFunction } from 'express'

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
