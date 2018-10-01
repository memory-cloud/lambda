const { FB } = require('fb')
const { FacebookServiceError } = require('../error')
// const debug = require('debug')('service:facebook')
class FacebookService {
  constructor (token, redis) {
    FB.setAccessToken(token)
    this.redis = redis
  }

  async getIdByToken (token) {
    try {
      return await this.redis.GetFromCache(token)
    } catch (err) {
      const response = await FB.api(`/debug_token?input_token=${token}`)

      if (response.data.error) throw new FacebookServiceError(response.data.error.message)

      const dateTime = Date.now()
      const timestamp = Math.floor(dateTime / 1000)

      await this.redis.setex(token, response.data.expires_at - timestamp, JSON.stringify(response.data.user_id))

      return response.data.user_id
    }
  }

  async getFriendsByPlayer (player) {
    const id = `${player.id}-friends`

    try {
      return await this.redis.GetFromCache(id)
    } catch (err) {
      var response = await FB.api('me/friends?fields=id')
      if (response.data.error) throw new FacebookServiceError(response.data.error.message)
      response.data.push({ id: player.fbid })
      const ids = response.data.map((user) => `${user.id}`)
      await this.redis.setex(id, 300, JSON.stringify(ids))
      return ids
    }
  }

  async getTestTokens () {
    const response = await FB.api(process.env.TEST_APPID + '/accounts/test-users?fields=access_token')
    if (response.data.error) throw new FacebookServiceError(response.data.error.message)
    return {
      player1: response.data[0].access_token,
      player2: response.data[1].access_token
    }
  }
}

module.exports = FacebookService
