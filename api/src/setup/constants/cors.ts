import Origins from "./origins"
import type { CorsOptions } from 'cors'
import { AppError } from "@error"

const corsConfig: CorsOptions = {
  origin: (origin = '', callback) => {
    if (Origins.allowed.includes(origin) === false) callback(new AppError('Not allowed by CORS', 403))
    callback(null, true)
  },
  credentials: true,
  optionsSuccessStatus: 200
}

export {
  corsConfig
}