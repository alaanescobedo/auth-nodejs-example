import 'dotenv/config'
import app from './app'
import { NODE_ENV, PORT } from '../constants'

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`)
  console.log(`Node env: ${NODE_ENV}`)
})