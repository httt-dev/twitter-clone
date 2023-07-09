import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.AccessToken },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id: user_id, token_type: TokenType.RefreshToken },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  /**
   * Resister new user
   * @param payload
   */
  async register(payload: RegisterReqBody) {
    // const { email, password } = payload
    const result = await databaseService.users.insertOne(
      new User({ ...payload, password: hashPassword(payload.password), date_of_birth: new Date(payload.date_of_birth) })
    )
    const user_id = result.insertedId.toHexString()

    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)

    // update refresh token
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
      //   result
    }
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)

    // update refresh token
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return {
      access_token,
      refresh_token
    }
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async isEmailExisted(email: string): Promise<boolean> {
    const user = await databaseService.users.findOne({ email: email })
    return user !== null
  }
}

const usersService = new UsersService()

export default usersService
