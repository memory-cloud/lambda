// const debug = require('debug')('service:state')
class SaveState extends require('../service') {
  async save (player, state) {
    if (state.strings) await this.SaveString(player, state.strings)
    if (state.integers) await this.SaveInteger(player, state.integers)
    if (state.floats) await this.SaveFloat(player, state.floats)
    if (state.booleans) await this.SaveBoolean(player, state.booleans)
    if (state.objects) await this.SaveObjects(player, state.objects)
    return true
  }

  async SaveString (player, strings) {
    await this.db.mongodb.collection('strings').bulkWrite(Options(player, strings))
  }

  async SaveBoolean (player, booleans) {
    await this.db.mongodb.collection('booleans').bulkWrite(Options(player, booleans))
  }

  async SaveObjects (player, objects) {
    await this.db.mongodb.collection('objects').bulkWrite(Options(player, objects))
  }

  async SaveInteger (player, integers) {
    await this.db.sequelize.Integer.bulkCreate(setPlayerId(player, integers), { updateOnDuplicate: true })
  }

  async SaveFloat (player, floats) {
    await this.db.sequelize.Float.bulkCreate(setPlayerId(player, floats), { updateOnDuplicate: true })
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

module.exports = SaveState
