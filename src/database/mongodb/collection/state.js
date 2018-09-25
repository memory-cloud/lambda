const Facebook = require('../../../service/facebook')
const debug = require('debug')('collection:state')
class State extends require('./collection') {
  constructor (db) {
    super(db, 'state')
  }

  async Save (player, state) {
    state.playerId = `${player.fbid}`
    state.gameId = player.gameId
    debug('asd')
    await this.collection.updateOne({ playerId: state.playerId }, { $set: state }, { upsert: true })
    return true
  }

  async Load (player) {
    return this.collection.findOne({ playerId: `${player.fbid}` })
  }

  async GlobalIntLeaderboard (player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    return this.collection.aggregate([
      { $match: { 'gameId': player.gameId } },
      { $project: { score: '$integers', fbid: '$playerId' } },
      { $unwind: '$score' },
      { $match: { 'score.key': key } },
      { $sort: { 'score.value': -1 } },
      { $skip: offset },
      { $limit: limit },
      { $project: { 'score': '$score.value', 'fbid': 1, '_id': 0 } }
    ]).toArray()
  }

  async FriendsIntLeaderboard (player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    return this.collection.aggregate([
      { $match: { 'playerId': { '$in': await new Facebook(player.token).getFriendsByPlayer(player) } } },
      { $project: { score: '$integers', fbid: '$playerId' } },
      { $unwind: '$score' },
      { $match: { 'score.key': key } },
      { $sort: { 'score.value': -1 } },
      { $skip: offset },
      { $limit: limit },
      { $project: { 'score': '$score.value', 'fbid': 1, '_id': 0 } }
    ]).toArray()
  }

  async GlobalFloatLeaderboard (player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    return this.collection.aggregate([
      { $match: { 'gameId': player.gameId } },
      { $project: { score: '$floats', fbid: '$playerId' } },
      { $unwind: '$score' },
      { $match: { 'score.key': key } },
      { $sort: { 'score.value': -1 } },
      { $skip: offset },
      { $limit: limit },
      { $project: { 'score': '$score.value', 'fbid': 1, '_id': 0 } }
    ]).toArray()
  }

  async FriendsFloatLeaderboard (player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    return this.collection.aggregate([
      { $match: { 'playerId': { '$in': await new Facebook(player.token).getFriendsByPlayer(player) } } },
      { $project: { score: '$floats', fbid: '$playerId' } },
      { $unwind: '$score' },
      { $match: { 'score.key': key } },
      { $sort: { 'score.value': -1 } },
      { $skip: offset },
      { $limit: limit },
      { $project: { 'score': '$score.value', 'fbid': 1, '_id': 0 } }
    ]).toArray()
  }
}

const check = (pageSize, page) => {
  pageSize = pageSize > 100 || pageSize < 0 ? 100 : pageSize
  page = page < 0 ? 0 : page
  return { limit: pageSize, offset: page * pageSize }
}

module.exports = State
