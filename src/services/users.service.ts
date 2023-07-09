import User from '~/models/schemas/User.schema'
import databaseService from './database.services'

class UsersService {
  /**
   * Resister new user
   * @param payload
   */
  async register(payload: { email: string; password: string }) {
    const { email, password } = payload
    const result = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return result
  }

  async isEmailExisted(email: string): Promise<boolean> {
    const user = await databaseService.users.findOne({ email: email })
    return user !== null
  }
}

const usersService = new UsersService()

export default usersService
