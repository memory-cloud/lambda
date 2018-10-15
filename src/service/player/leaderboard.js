const Facebook = require('./facebookService')
const Service = require('../service')
// const debug = require('debug')('service:player:leaderboard')
class LeaderboardsRepository extends Service {
  async GlobalIntLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('Integers', false, player, key, pageSize, page))
    return leaderboard[0]
  }
  async FriendsIntLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('Integers', true, player, key, pageSize, page))
    return leaderboard[0]
  }
  async GlobalFloatLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('Floats', false, player, key, pageSize, page))
    return leaderboard[0]
  }
  async FriendsFloatLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('Floats', true, player, key, pageSize, page))
    return leaderboard[0]
  }

  async queryLeaderboard (table, friends, player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    return [
      `SELECT p.fbid AS fbid, p.id AS id, s.value as score FROM Players p
      INNER JOIN ${table} s ON s.PlayerId = p.id
      ${friends ? `WHERE p.fbid IN (:playersIds)` : `WHERE p.GameId = :GameId`}
      AND s.key = :key
      ORDER BY score DESC
      LIMIT :offset, :limit`,
      friends
        ? { replacements: { playersIds: await new Facebook(this.db, player.token).getFriendsByPlayer(player), key: key, limit: limit, offset: offset } }
        : { replacements: { GameId: player.GameId, key: key, limit: limit, offset: offset } }]
  }
}
const check = (pageSize, page) => {
  pageSize = pageSize > 100 || pageSize < 0 ? 100 : pageSize
  page = page < 0 ? 0 : page
  return { limit: pageSize, offset: page * pageSize }
}

module.exports = LeaderboardsRepository
