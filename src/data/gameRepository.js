const debug = require('debug')('repository:game')

class GameRepository {
  constructor (db) {
    if (!GameRepository.instance) {
      this.db = db
      this.Game = db.import('Game', require('../model/game'))
      this.Achievement = db.import('Achievement', require('../model/achievement'))
      GameRepository.instance = this
    }
    return GameRepository.instance
  }

  async games (admin) {
    const games = await this.db.query(
      'SELECT * FROM games ' +
      'WHERE games.adminId = :adminId',
      { replacements: { adminId: admin.id } }
    )
    return games[0]
  }

  async game (admin, id) {
    let game = await this.Game.findOne({ where: { adminId: admin.id, id: id } })
    if (!game) {
      throw new Error('Game not found')
    }
    return game
  }

  async createGame (admin, game) {
    game.adminId = admin.id
    try {
      game = await this.Game.create(game)
    } catch (err) {
      debug(err)
      return err
    }
    return game
  }

  async findByAdmin (admin) {
    return this.Game.findOne({ where: { adminId: admin.id } })
  }

  async findByAppId (appid) {
    return this.Game.findOne({ where: { appid: appid } })
  }
}

module.exports = GameRepository
