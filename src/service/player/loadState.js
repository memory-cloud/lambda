// const debug = require('debug')('service:state')
class LoadState extends require('../service') {
  async strings (player) {
    return this.db.mongodb.collection('strings').find({ PlayerId: player.id }).toArray()
  }

  async booleans (player) {
    return this.db.mongodb.collection('booleans').find({ PlayerId: player.id }).toArray()
  }

  async objects (player) {
    return this.db.mongodb.collection('objects').find({ PlayerId: player.id }).toArray()
  }

  async integers (player) {
    return this.db.sequelize.Integer.findAll({ where: { PlayerId: player.id }, attributes: ['key', 'value'] })
  }
  async floats (player) {
    return this.db.sequelize.Float.findAll({ where: { PlayerId: player.id }, attributes: ['key', 'value'] })
  }
}

module.exports = LoadState
