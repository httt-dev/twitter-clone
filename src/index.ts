import express, { Request, Response, NextFunction } from 'express'
import userRouters from './routes/users.routes'
import databaseService from './services/database.services'

const router = express.Router()

const app = express()
const port = 3000

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Xin chao')
})

app.use('/users', userRouters)

databaseService.connect()

// error handler ( express)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(400).json({ error: err.message })
})

app.listen(port, () => {
  console.log(`Application listening on port ${port}`)
})
