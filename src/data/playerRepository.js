const debug = require('debug')('repository:player')

class PlayerRepository {
  constructor (db) {
    if (!PlayerRepository.instance) {
      this.db = db
      this.Integer = db.import('Integer', require('../model/integer'))
      this.Float = db.import('Float', require('../model/float'))
      this.Boolean = db.import('Boolean', require('../model/boolean'))
      this.String = db.import('String', require('../model/string'))
      this.Player = db.import('Player', require('../model/player'))
      PlayerRepository.instance = this
    }
    return PlayerRepository.instance
  }
  async saveState (player, integers, floats, booleans, strings) {
    try {
      if (integers) {
        integers.forEach(element => { element.playerId = player.id })
        await this.Integer.bulkCreate(integers, { updateOnDuplicate: true })
      }
      if (floats) {
        floats.forEach(element => { element.playerId = player.id })
        await this.Float.bulkCreate(floats, { updateOnDuplicate: true })
      }
      if (booleans) {
        booleans.forEach(element => { element.playerId = player.id })
        await this.Boolean.bulkCreate(booleans, { updateOnDuplicate: true })
      }
      if (strings) {
        strings.forEach(element => { element.playerId = player.id })
        await this.String.bulkCreate(strings, { updateOnDuplicate: true })
      }
      return true
    } catch (err) {
      debug(err)
      return false
    }
  }

  async loadIntegers (player) {
    return this.Integer.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async loadFloats (player) {
    return this.Float.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async loadStrings (player) {
    return this.String.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async loadBooleans (player) {
    return this.Boolean.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async findOrCreate (fbid, game) {
    return this.Player.findOrCreate({ where: { fbid: fbid, gameId: game.id } })
  }
}

module.exports = PlayerRepository
