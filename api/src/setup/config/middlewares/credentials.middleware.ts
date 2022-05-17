import type { NextFunction, Request, Response } from "express"
import Origins from "../../constants/origins"

const credentials = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin ?? ''
  if (Origins.allowed.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', 'true')
  }
  next()
}

export default credentials