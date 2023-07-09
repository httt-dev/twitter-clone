import express from 'express'
import userRouters from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const router = express.Router()

const app = express()
const port = 3000

databaseService.connect()

app.use(express.json())

app.use('/users', userRouters)

// error handler ( express)
app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Application listening on port ${port}`)
})
