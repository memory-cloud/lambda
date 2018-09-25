const { FB } = require('fb')

class FacebookService {
  constructor (token) {
    FB.setAccessToken(token)
  }

  async getIdByToken (token) {
    const response = await FB.api(`/debug_token?input_token=${token}`)
    if (response.data.error) return new Error(response.data.error.message)
    return response.data.user_id
  }

  async getFriendsByPlayer (player) {
    var friendsIds = await FB.api('me/friends?fields=id')
    friendsIds.data.push({ id: player.fbid })
    return friendsIds.data.map((user) => `${user.id}`)
  }

  async getTestTokens () {
    const res = await FB.api(process.env.TEST_APPID + '/accounts/test-users?fields=access_token')
    return {
      player1: res.data[0].access_token,
      player2: res.data[1].access_token
    }
  }
}

module.exports = FacebookService
