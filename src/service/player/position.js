const Facebook = require('./facebookService')
const Service = require('../service')
// const debug = require('debug')('service:player:leaderboard')
class LeaderboardsRepository extends Service {
  async GlobalIntPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('integers', false, player, key))
    return position[0][0]
  }
  async GlobalFloatPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('floats', false, player, key))
    return position[0][0]
  }
  async FriendsIntPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('integers', true, player, key))
    return position[0][0]
  }
  async FriendsFloatPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('floats', true, player, key))
    return position[0][0]
  }

  async queryPosition (table, friends, player, key) {
    await this.db.sequelize.query('SET @pos = 0')
    return [`
      SELECT * FROM
      (
        SELECT (@pos:=@pos+1) position, players.id as id, players.fbid as fbid, ${table}.value as score
        FROM players
        INNER JOIN ${table} ON ${table}.playerId = players.id
        WHERE ${friends ? 'players.fbid IN (:playersIds)' : 'players.gameId = :gameId'}
        AND ${table}.key = :key
        ORDER BY score DESC
      ) A
      WHERE ${friends ? 'fbid = :fbid' : 'id = :playerId'}`,
    friends
      ? { replacements: { playersIds: await new Facebook(this.db, player.token).getFriendsByPlayer(player), gameId: player.gameId, key: key, fbid: player.fbid } }
      : { replacements: { gameId: player.gameId, key: key, playerId: player.id } }]
  }
}

module.exports = LeaderboardsRepository
