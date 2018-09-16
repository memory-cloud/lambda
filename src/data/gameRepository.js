// const debug = require('debug')('repository:game')
const Repository = require('./repository')

class GameRepository extends Repository {
  async games (admin) {
    return this.db.Game.findAll({ where: { adminId: admin.id } })
  }

  async game (admin, id) {
    let game = await this.db.Game.findOne({ where: { adminId: admin.id, id: id } })

    if (!game) throw new Error('Game not found')

    return game
  }

  async createGame (admin, game) {
    game.adminId = admin.id
    return this.db.Game.create(game)
  }

  async findByAppId (appid) {
    return this.db.Game.findOne({ where: { appid: appid } })
  }

  async playersCount (game) {
    const players = await this.db.query(
      'SELECT COUNT(*) FROM players WHERE gameId = :gameId',
      { replacements: { gameId: game.id } }
    )
    return players[0][0]['COUNT(*)']
  }
}

module.exports = GameRepository
