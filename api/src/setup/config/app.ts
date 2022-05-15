import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRouter from '../../module/auth'
import { NODE_ENV } from '../constants'
import errorHandler from '../../module/error/errorHandler'

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

app.use('/api/v1/auth', authRouter)
if (NODE_ENV === 'development' || NODE_ENV === 'test') {
  // app.use('/api/v1/seeds')
}

app.all('*', (req, res) => {
  res.status(404).send({ status: 'Failed', message: 'Not found', url: req.originalUrl })
})

app.use(errorHandler)

export default app