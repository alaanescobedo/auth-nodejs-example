import { NODE_ENV } from "./env"

const allowedProd = [
  'https://www.yourdomain.com',
]

const allowedDev = [
  `http://localhost:3000`,
  `http://localhost:3333`,
]

export default {
  allowed: NODE_ENV === 'production' ? allowedProd : allowedDev
}