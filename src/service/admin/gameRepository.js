// const debug = require('debug')('repository:game')
const Service = require('../service')
const { GameNotFoundError } = require('../../error')

class GameRepository extends Service {
  async games (admin) {
    return this.db.sequelize.Game.findAll({ where: { AdminId: admin.id } })
  }

  async game (admin, id) {
    const game = await this.db.sequelize.Game.findOne({ where: { AdminId: admin.id, id: id } })
    if (!game) throw new GameNotFoundError()
    return game
  }

  async createGame (admin, game) {
    game.AdminId = admin.id
    return this.db.sequelize.Game.create(game)
  }

  async playersCount (game) {
    const players = await this.db.sequelize.query(
      'SELECT COUNT(*) FROM Players WHERE GameId = :GameId',
      { replacements: { GameId: game.id } }
    )
    return players[0][0]['COUNT(*)']
  }
}

module.exports = GameRepository
