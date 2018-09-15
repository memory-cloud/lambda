const debug = require('debug')('repository:player')
const Repository = require('./repository')

class PlayerRepository extends Repository {
  async saveState (player, integers, floats, booleans, strings) {
    try {
      if (integers) {
        integers.forEach(element => { element.playerId = player.id })
        await this.db.Integer.bulkCreate(integers, { updateOnDuplicate: true })
      }
      if (floats) {
        floats.forEach(element => { element.playerId = player.id })
        await this.db.Float.bulkCreate(floats, { updateOnDuplicate: true })
      }
      if (booleans) {
        booleans.forEach(element => { element.playerId = player.id })
        await this.db.Boolean.bulkCreate(booleans, { updateOnDuplicate: true })
      }
      if (strings) {
        strings.forEach(element => { element.playerId = player.id })
        await this.db.String.bulkCreate(strings, { updateOnDuplicate: true })
      }
      return true
    } catch (err) {
      debug(err)
      return false
    }
  }

  async loadIntegers (player) {
    return this.db.Integer.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async loadFloats (player) {
    return this.db.Float.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async loadStrings (player) {
    return this.db.String.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async loadBooleans (player) {
    return this.db.Boolean.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }

  async findOrCreate (fbid, game) {
    return this.db.Player.findOrCreate({ where: { fbid: fbid, gameId: game.id } })
  }
}

module.exports = PlayerRepository
