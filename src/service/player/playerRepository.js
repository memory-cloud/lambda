// const debug = require('debug')('repository:player')
const Service = require('../service')
const Facebook = require('./facebookService')

class PlayerRepository extends Service {
  async findByGameAndToken (game, token) {
    const fbid = await new Facebook(this.db, game.getToken()).getIdByToken(token)
    const player = await this.db.sequelize.Player.findOrCreate({ where: { fbid: fbid, GameId: game.id } })
    player[0].token = token
    return player[0]
  }
}

module.exports = PlayerRepository
