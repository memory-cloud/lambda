// const debug = require('debug')('service:state')
class LoadState extends require('../service') {
  async strings (player) {
    return this.db.mongodb.collection('strings').find({ playerId: player.id }).toArray()
  }

  async booleans (player) {
    return this.db.mongodb.collection('booleans').find({ playerId: player.id }).toArray()
  }

  async objects (player) {
    return this.db.mongodb.collection('objects').find({ playerId: player.id }).toArray()
  }

  async integers (player) {
    return this.db.sequelize.Integer.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }
  async floats (player) {
    return this.db.sequelize.Float.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }
}

module.exports = LoadState
