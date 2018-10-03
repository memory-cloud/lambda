const Facebook = require('./facebookService')
const Service = require('../service')
// const debug = require('debug')('service:player:leaderboard')
class LeaderboardsRepository extends Service {
  async GlobalIntLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('integers', false, player, key, pageSize, page))
    return leaderboard[0]
  }
  async FriendsIntLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('integers', true, player, key, pageSize, page))
    return leaderboard[0]
  }
  async GlobalFloatLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('floats', false, player, key, pageSize, page))
    return leaderboard[0]
  }
  async FriendsFloatLeaderboard (player, key, pageSize, page) {
    const leaderboard = await this.db.sequelize.query(...await this.queryLeaderboard('floats', true, player, key, pageSize, page))
    return leaderboard[0]
  }

  async queryLeaderboard (table, friends, player, key, pageSize, page) {
    const { limit, offset } = check(pageSize, page)
    await this.db.sequelize.query(`SET @pos = ${offset}`)
    return [`
    SELECT * FROM
      (
      SELECT (@pos:=@pos+1) position, players.fbid AS fbid, players.id AS id, ${table}.value as score FROM players
      INNER JOIN ${table} ON ${table}.playerId = players.id
      ${friends ? 'WHERE players.fbid IN (:playersIds)' : 'WHERE players.gameId = :gameId'}
      AND ${table}.key = :key
      ORDER BY score DESC
      LIMIT :offset, :limit
      ) A
      `,
    friends
      ? { replacements: { playersIds: await new Facebook(this.db, player.token).getFriendsByPlayer(player), key: key, limit: limit, offset: offset } }
      : { replacements: { gameId: player.gameId, key: key, limit: limit, offset: offset } }]
  }
}
const check = (pageSize, page) => {
  pageSize = pageSize > 100 || pageSize < 0 ? 100 : pageSize
  page = page < 0 ? 0 : page
  return { limit: pageSize, offset: page * pageSize }
}

module.exports = LeaderboardsRepository
