// const debug = require('debug')('repository:player')
const Repository = require('./repository')
const Facebook = require('../../../service/facebook')

class PlayerRepository extends Repository {
  async findOrCreate (fbid, game) {
    return this.db.Player.findOrCreate({ where: { fbid: fbid, gameId: game.id } })
  }

  async findByGameAndToken (game, token) {
    const fbid = await new Facebook(game.getToken()).getIdByToken(token)
    const player = await this.db.Player.findOrCreate({ where: { fbid: fbid, gameId: game.id } })
    player[0].token = token
    return player[0]
  }
}

module.exports = PlayerRepository
