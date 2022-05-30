import type { CookieOptions, Response } from "express"
import { COOKIE_SAME_SITE, COOKIE_SECURE } from "@setup/constants"

type CookieType = 'rt'
// type RefreshResponse = { newAccessToken: string, response: Response }
type ClearCookies = Omit<Cookie, 'value'>
// type RevokeToken = Omit<Cookie, 'options'>

export interface Cookie {
  name: CookieType
  value: any,
  options?: CookieOptions | undefined
}

const ONE_DAY = 1000 * 60 * 60 * 24
/**
 * The configuration of cookies to work in a local environment is different from the one required for production environments (if its's https, which is recommended).
 * And at the same time it can change depending on how the domains of the client and server are configured.
 * 
 * ? This section can be a reference for possible issues in production
 *  */
const defaultConfig: CookieOptions = {
  httpOnly: true,
  maxAge: ONE_DAY,
  sameSite: COOKIE_SAME_SITE,
  secure: COOKIE_SECURE, // if sameSITE is none, secure should be true
}

const create = (response: Response,
  { name, value, options = defaultConfig }: Cookie): Response => {
  return response.cookie(name, value, options)
}
const clear = (response: Response,
  { name, options = defaultConfig }: ClearCookies): Response => {
  return response.clearCookie(name, options)
}


export const CookieService = {
  create,
  clear
}


// Resources:
// https://mrcoles.com/blog/cookies-max-age-vs-expires/
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
// https://web.dev/i18n/en/samesite-cookies-explained/
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
// https://web.dev/when-to-use-local-https/
// https://owasp.org/www-community/controls/SecureCookieAttribute