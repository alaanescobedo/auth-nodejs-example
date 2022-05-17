export const NODE_ENV = process.env['NODE_ENV'] ?? 'development'
export const MONGO_URL = process.env['MONGO_URL'] ?? ''
export const JWT_SECRET = process.env['JWT_SECRET'] ?? ''
export const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] ?? ''
export const PORT = process.env['PORT'] ?? 3000

// EMAIL
export const APP_EMAIL_HOST_PRODUCTION = process.env['APP_EMAIL_HOST_PRODUCTION'] ?? ''
export const APP_EMAIL_PORT_PRODUCTION = process.env['APP_EMAIL_PORT_PRODUCTION'] ?? ''
export const APP_EMAIL_USER_PRODUCTION = process.env['APP_EMAIL_USER_PRODUCTION'] ?? ''
export const APP_EMAIL_PASSWORD_PRODUCTION = process.env['APP_EMAIL_PASSWORD_PRODUCTION'] ?? ''
export const APP_EMAIL_USER_DEVELOPMENT = process.env['APP_EMAIL_USER_DEVELOPMENT'] ?? ''
export const APP_EMAIL_PASSWORD_DEVELOPMENT = process.env['APP_EMAIL_PASSWORD_DEVELOPMENT'] ?? ''
export const APP_EMAIL_USER_TEST = process.env['APP_EMAIL_USER_TEST'] ?? ''
export const APP_EMAIL_PASSWORD_TEST = process.env['APP_EMAIL_PASSWORD_TEST'] ?? ''

// COOKIE
export const COOKIE_SAME_SITE = process.env['COOKIE_SAME_SITE'] as 'none' | 'lax' | 'strict' ?? 'none'
export const COOKIE_SECURE = process.env['COOKIE_SECURE'] === 'true' ?? true