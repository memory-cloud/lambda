// const debug = require('debug')('repository:game')
const Service = require('../service')
const { GameNotFoundError } = require('../../error')

class GameRepository extends Service {
  async findByAppId (appid) {
    const game = await this.db.sequelize.Game.findOne({ where: { appid: appid } })
    if (!game) throw new GameNotFoundError()
    return game
  }
}

module.exports = GameRepository
