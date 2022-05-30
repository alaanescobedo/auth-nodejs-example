import { AppError } from "@error"

export const CookieGuard = (cookie: 'jt') => {
  const isValid = cookie !== undefined && cookie !== null // TODO: create a list of avaible cookies names
  if (isValid === false) throw new AppError('No Content - Cookie not found', 400)
  return cookie
}