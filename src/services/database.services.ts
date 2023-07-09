import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'

dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1c8nrhl.mongodb.net/?retryWrites=true&w=majority`

class DatabaseService {
  private static instance: DatabaseService

  private client: MongoClient

  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your development. You successfully connected to MongoDB')
    } catch (error) {
      console.log('Error', error)
      throw error
    } finally {
      //   await this.client.close()
    }
  }

  disconnect() {
    return this.client.close()
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }
}

const databaseService = DatabaseService.getInstance()

export default databaseService
