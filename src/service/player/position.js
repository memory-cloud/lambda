const Facebook = require('./facebookService')
const Service = require('../service')
// const debug = require('debug')('service:player:position')
class LeaderboardsRepository extends Service {
  async GlobalIntPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('Integers', false, player, key))
    return position[0][1][0]['position']
  }
  async GlobalFloatPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('Floats', false, player, key))
    return position[0][1][0]['position']
  }
  async FriendsIntPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('Integers', true, player, key))
    return position[0][1][0]['position']
  }
  async FriendsFloatPosition (player, key) {
    const position = await this.db.sequelize.query(...await this.queryPosition('Floats', true, player, key))
    return position[0][1][0]['position']
  }

  async queryPosition (table, friends, player, key) {
    return [`
      SET @pos = 0;
      SELECT position FROM
      (
        SELECT (@pos:=@pos+1) position, ${friends ? 'p.fbid as fbid' : 'p.id as id'}, s.value as score
        FROM Players p
        INNER JOIN ${table} s ON s.PlayerId = p.id
        WHERE ${friends ? 'p.fbid IN (:playersIds)' : 'p.GameId = :GameId'}
        AND s.key = :key
        ORDER BY score DESC
      ) A
      WHERE ${friends ? 'fbid = :fbid' : 'id = :PlayerId'};`,
    friends
      ? { replacements: { playersIds: await new Facebook(this.db, player.token).getFriendsByPlayer(player), GameId: player.GameId, key: key, fbid: player.fbid } }
      : { replacements: { GameId: player.GameId, key: key, PlayerId: player.id } }]
  }
}

module.exports = LeaderboardsRepository
