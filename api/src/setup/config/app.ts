import express from 'express'
import morgan from 'morgan'
import authRouter from '../../module/auth'

const app = express()
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/auth', authRouter)

app.all('*', (req, res) => {
  res.status(404).send({ status: 'Failed', message: 'Not found', url: req.originalUrl })
})

export default app