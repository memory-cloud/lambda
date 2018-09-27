const Facebook = require('../../../service/facebook')
// const debug = require('debug')('collection:state')
class State extends require('./collection') {
  async Save (player, state) {
    state.playerId = `${player.fbid}`
    state.gameId = player.gameId
    await this.collection.updateOne({ playerId: state.playerId }, { $set: state }, { upsert: true })
    return true
  }

  async Load (player) {
    return this.collection.findOne({ playerId: `${player.fbid}` })
  }

  async GlobalIntLeaderboard (player, key, pageSize, page) {
    return this.collection.aggregate([
      { $match: { 'gameId': player.gameId } },
      ...Options('integers', key, pageSize, page)
    ]).toArray()
  }

  async FriendsIntLeaderboard (player, key, pageSize, page) {
    return this.collection.aggregate([
      { $match: { 'playerId': { '$in': await new Facebook(player.token).getFriendsByPlayer(player) } } },
      ...Options('integers', key, pageSize, page)
    ]).toArray()
  }

  async GlobalFloatLeaderboard (player, key, pageSize, page) {
    return this.collection.aggregate([
      { $match: { 'gameId': player.gameId } },
      ...Options('floats', key, pageSize, page)
    ]).toArray()
  }

  async FriendsFloatLeaderboard (player, key, pageSize, page) {
    return this.collection.aggregate([
      { $match: { 'playerId': { '$in': await new Facebook(player.token).getFriendsByPlayer(player) } } },
      ...Options('floats', key, pageSize, page)
    ]).toArray()
  }
}

const check = (pageSize, page) => {
  pageSize = pageSize > 100 || pageSize < 0 ? 100 : pageSize
  page = page < 0 ? 0 : page
  return { limit: pageSize, offset: page * pageSize }
}

const Options = (table, key, pageSize, page) => {
  const { limit, offset } = check(pageSize, page)
  return [{ $project: { score: `$${table}`, fbid: '$playerId' } },
    { $unwind: '$score' },
    { $match: { 'score.key': key } },
    { $sort: { 'score.value': -1 } },
    { $skip: offset },
    { $limit: limit },
    { $project: { 'score': '$score.value', 'fbid': 1, '_id': 0 } }]
}

module.exports = State
