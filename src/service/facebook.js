const { FB } = require('fb')
const Service = require('./service')
const { FacebookServiceError } = require('../error')
class Facebook extends Service {
  constructor (db, token) {
    super(db)
    FB.setAccessToken(token)
  }
  async getTestTokens () {
    const data = await this.api(process.env.TEST_APPID + '/accounts/test-users?fields=access_token')
    return {
      player1: data[0].access_token,
      player2: data[1].access_token
    }
  }

  async api (query) {
    const response = await FB.api(query)
    if (response.data.error) throw new FacebookServiceError(response.data.error.message)
    return response.data
  }
}

module.exports = Facebook
