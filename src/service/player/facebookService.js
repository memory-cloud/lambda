// const debug = require('debug')('service:facebook')
const Facebook = require('../facebook')
class FacebookService extends Facebook {
  async getIdByToken (token) {
    try {
      return await this.db.redis.getId(token)
    } catch (err) {
      const data = await this.api(`/debug_token?input_token=${token}`)

      const dateTime = Date.now()
      const timestamp = Math.floor(dateTime / 1000)

      await this.db.redis.setex(token, data.expires_at - timestamp, JSON.stringify(data.user_id))

      return data.user_id
    }
  }

  async getFriendsByPlayer (player) {
    const id = `${player.id}-friends`

    try {
      return await this.db.redis.getId(id)
    } catch (err) {
      var data = await this.api('me/friends?fields=id')
      data.push({ id: player.fbid })
      const ids = data.map((user) => `${user.id}`)
      await this.db.redis.setex(id, 300, JSON.stringify(ids))
      return ids
    }
  }
}

module.exports = FacebookService
