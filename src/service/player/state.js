// const debug = require('debug')('service:state')
class State extends require('../service') {
  constructor (db) {
    super(db)
    this.db.mongodb.booleans = db.mongodb.collection('booleans')
    this.db.mongodb.strings = db.mongodb.collection('strings')
    this.db.mongodb.objects = db.mongodb.collection('objects')
  }

  async save (player, state) {
    if (state.strings) await this.SaveString(player, state.strings)
    if (state.integers) await this.SaveInteger(player, state.integers)
    if (state.floats) await this.SaveFloat(player, state.floats)
    if (state.booleans) await this.SaveBoolean(player, state.booleans)
    if (state.objects) await this.SaveObjects(player, state.objects)
    return true
  }

  async SaveString (player, strings) {
    await this.db.mongodb.strings.bulkWrite(Options(player, strings))
  }

  async SaveBoolean (player, booleans) {
    await this.db.mongodb.booleans.bulkWrite(Options(player, booleans))
  }

  async SaveObjects (player, objects) {
    await this.db.mongodb.objects.bulkWrite(Options(player, objects))
  }

  async SaveInteger (player, integers) {
    await this.db.sequelize.Integer.bulkCreate(setPlayerId(player, integers), { updateOnDuplicate: true })
  }

  async SaveFloat (player, floats) {
    await this.db.sequelize.Float.bulkCreate(setPlayerId(player, floats), { updateOnDuplicate: true })
  }

  async loadStrings (player) {
    return this.db.mongodb.strings.find({ playerId: player.id }).toArray()
  }

  async loadBooleans (player) {
    return this.db.mongodb.booleans.find({ playerId: player.id }).toArray()
  }

  async loadObjects (player) {
    return this.db.mongodb.objects.find({ playerId: player.id }).toArray()
  }

  async loadIntegers (player) {
    return this.db.sequelize.Integer.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }
  async loadFloats (player) {
    return this.db.sequelize.Float.findAll({ where: { playerId: player.id }, attributes: ['key', 'value'] })
  }
}

const setPlayerId = (player, state) => {
  state.forEach(element => { element.playerId = player.id })
  return state
}

const Options = (player, state) => {
  state = setPlayerId(player, state)
  var ops = []
  state.forEach(item => {
    ops.push(
      {
        updateOne: {
          filter: { playerId: player.id, key: item.key },
          update: {
            $set: {
              value: item.value
            }
          },
          upsert: true
        }
      }
    )
  })
  return ops
}

module.exports = State
