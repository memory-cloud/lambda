const debug = require('debug')('repository:leaderboard')
const { FB } = require('fb')

class LeaderboardsRepository {
  constructor (db) {
    if (!LeaderboardsRepository.instance) {
      this.db = db
      LeaderboardsRepository.instance = this
    }
    return LeaderboardsRepository.instance
  }

  async getInt (gameId, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    try {
      const leaderboard = await this.db.query(
        'SELECT players.fbid AS id, integers.value as score FROM players ' +
        'INNER JOIN integers ON integers.playerId = players.id ' +
        'WHERE players.gameId = :gameId ' +
        'AND integers.key = :key ' +
        'ORDER BY score DESC ' +
        'LIMIT :offset, :limit',
        { replacements: { gameId: gameId, key: key, limit: limit, offset: limit * offset } })
      return leaderboard[0]
    } catch (err) {
      debug(err)
      return []
    }
  }

  async getIntFriends (player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    try {
      const leaderboard = await this.db.query(
        'SELECT players.fbid AS id, integers.value as score FROM players ' +
            'INNER JOIN integers ON integers.playerId = players.id ' +
          'WHERE players.fbid IN (:playersIds) ' +
            'AND integers.key = :key ' +
          'ORDER BY score DESC ' +
          'LIMIT :offset, :limit',
        { replacements: { playersIds: await getFriends(player), key: key, limit: limit, offset: limit * offset } })
      return leaderboard[0]
    } catch (err) {
      debug(err)
      return []
    }
  }

  async getFloat (gameId, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    try {
      const leaderboard = await this.db.query(
        'SELECT players.fbid AS id, floats.value as score FROM players ' +
        'INNER JOIN floats ON floats.playerId = players.id ' +
        'WHERE players.gameId = :gameId ' +
        'AND floats.key = :key ' +
        'ORDER BY score DESC ' +
        'LIMIT :offset, :limit',
        { replacements: { gameId: gameId, key: key, limit: limit, offset: limit * offset } })
      return leaderboard[0]
    } catch (err) {
      debug(err)
      return []
    }
  }

  async getFloatFriends (player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    try {
      const leaderboard = await this.db.query(
        'SELECT players.fbid AS id, floats.value as score FROM players ' +
            'INNER JOIN floats ON floats.playerId = players.id ' +
          'WHERE players.fbid IN (:playersIds) ' +
            'AND floats.key = :key ' +
          'ORDER BY score DESC ' +
          'LIMIT :offset, :limit',
        { replacements: { playersIds: await getFriends(player), key: key, limit: limit, offset: limit * offset } })
      return leaderboard[0]
    } catch (err) {
      debug(err)
      return []
    }
  }
}

const check = function (pageSize, page) {
  pageSize = pageSize > 100 || pageSize < 0 ? 100 : pageSize
  page = page < 0 ? 0 : page
  return { limit: pageSize, offset: page * pageSize }
}

const getFriends = async function (player) {
  FB.setAccessToken(player.token)
  var friendsIds = await FB.api('me/friends?fields=id')
  friendsIds.data.push({ id: player.fbid })
  return friendsIds.data.map((user) => user.id)
}

module.exports = LeaderboardsRepository
