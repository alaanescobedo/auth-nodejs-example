import type { Request, Response } from "express"
import { db } from "../../../setup/config"
import AppError from "../../error/errorApp"
import { catchError } from "../../error/utils"
import { secureTokens } from "../helpers/secure-token"
import { Token } from "../services"
import cookieService from "../services/cookie.service"
import { TokenStorage, AuthStorage } from "../storage"

const refreshToken = catchError(async (req: Request, res: Response) => {
  const { rt: refreshToken } = req.cookies
  if (refreshToken === undefined) throw new AppError('No refresh token', 401)
  res = cookieService.clear(res, { cookie: 'rt' })

  db.connect()
  const tokenData = await TokenStorage.findOne({ token: refreshToken })
  // ?DEBUG console.log({ tokenData })
  if (tokenData === null) {
    const decoded = Token.verify({ token: refreshToken, refresh: true }) as { data: string }
    // The token does not belong to any user
    //  Possibly invented token
    if (decoded === null) throw new AppError('No Content', 404)
    // ?DEBUG console.log({ decoded })
    // Possibly the token has been stolen
    // Clear all refresh tokens for this user
    const userHacked = await AuthStorage.findUserById({ id: decoded?.data }) // TODO: Only return the user-id, no all the user-data
    // ?DEBUG console.log({ userHacked })
    if (userHacked) {
      // User also should clear cookies in client
      await TokenStorage.destroyAll({ user: userHacked._id })
      //Todo Notify User of attempted hack
      // Send email to user
    }
    throw new AppError('No Content', 404)
  }
  const { user } = tokenData
  await TokenStorage.destroy({ token: refreshToken })

  // TODO: Duplicate code - move to a helper
  const atData = {
    username: user.username,
    roles: null
  }

  // TODO: END TODO
  const { newAccessToken, response } = await secureTokens(res, {
    at: { data: atData },
    user: user._id,
    agent: tokenData.agent,
    cookie: 'rt'
  })

  db.disconnect()

  response.status(200).json({
    status: 'success',
    token: newAccessToken,
  })
})

export { refreshToken }