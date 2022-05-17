import type { NextFunction, Request, Response } from 'express'
import type { SchemaOf } from 'yup'
import { catchError } from '../module/error/utils'

const validateRequest: Function = (schema: SchemaOf<any>): Function => catchError(async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  await schema.validate(req.body)
  next()
})

export default validateRequest
