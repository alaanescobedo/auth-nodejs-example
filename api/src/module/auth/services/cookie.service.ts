import type { CookieOptions, Response } from "express"
import { COOKIE_SAME_SITE, COOKIE_SECURE } from "@setup/constants"

const ONE_DAY = 1000 * 60 * 60 * 24
/**
 * The configuration of cookies to work in a local environment is different from the one required for production environments (if its's https, which is recommended).
 * And at the same time it can change depending on how the domains of the client and server are configured.
 * 
 * ? This section can be a reference for possible issues in production
 *  */
const defaultCookieConfig: CookieOptions = {
  httpOnly: true,
  maxAge: ONE_DAY,
  sameSite: COOKIE_SAME_SITE,
  secure: COOKIE_SECURE, // if sameSITE is none, secure should be true
}

export type Cookie = 'rt'

interface CookieService {
  cookie: Cookie
  cookieConfig?: CookieOptions
  token: any,
}

const create = (response: Response,
  { cookie, token, cookieConfig = defaultCookieConfig }: CookieService): Response => {
  return response.cookie(cookie, token, cookieConfig)
}

const clear = (response: Response,
  { cookie, cookieConfig = defaultCookieConfig }: Omit<CookieService, 'token'>): Response => {
  return response.clearCookie(cookie, cookieConfig)
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