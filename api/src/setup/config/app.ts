import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRouter from '../../module/auth'
import credentials from './middlewares/credentials.middleware'
import errorHandler from '../../module/error/errorHandler.controller'
import { NODE_ENV, corsConfig } from '../constants'

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use(credentials)
app.use(cors(corsConfig))

app.use('/api/v1/auth', authRouter)
if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  // app.use('/api/v1/seeds')
}

app.all('*', (req, res) => {
  res.status(404).send({ status: 'Failed', message: 'Not found', url: req.originalUrl })
})

app.use(errorHandler)

export default app