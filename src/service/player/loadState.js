// const debug = require('debug')('service:state')
class LoadState extends require('../service') {
  constructor (db) {
    super(db)
    this.db.mongodb.booleans = db.mongodb.collection('booleans')
    this.db.mongodb.strings = db.mongodb.collection('strings')
    this.db.mongodb.objects = db.mongodb.collection('objects')
  }

  async strings (player) {
    return this.db.mongodb.strings.find({ playerId: player.id }).toArray()
  }

  async booleans (player) {
    return this.db.mongodb.booleans.find({ playerId: player.id }).toArray()
  }

  async objects (player) {
    return this.db.mongodb.objects.find({ playerId: player.id }).toArray()
  }

  async integers (player) {
    return this.db.sequelize.Integer.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }
  async floats (player) {
    return this.db.sequelize.Float.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }
}

module.exports = LoadState
