import type { Request, Response } from "express"
import { db } from "../../../setup/config"
import AppError from "../../error/errorApp"
import { catchError } from "../../error/utils"
import cookieService from "../services/cookie.service"
import { TokenStorage } from "../storage"

const disconnect = catchError(async (req: Request, res: Response) => {
  const { rt: refreshToken } = req.cookies

  db.connect()
  const tokenData = await TokenStorage.findOne({ token: refreshToken })
  db.disconnect()
  if (tokenData === null) throw new AppError('No Content', 404)

  const response = cookieService.clear(res, { cookie: 'rt' })
  await TokenStorage.destroy({ token: refreshToken })

  return response.status(200).json({})
})

export { disconnect }