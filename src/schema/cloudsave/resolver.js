// const debug = require('debug')('cloudsave-resolver')
const PlayerRepository = require('../../data/playerRepository')

exports.resolver = {
  State: {
    integers (root, params, context) {
      return new PlayerRepository(context.db).loadIntegers(context.player)
    },
    floats (root, params, context) {
      return new PlayerRepository(context.db).loadFloats(context.player)
    },
    strings (root, params, context) {
      return new PlayerRepository(context.db).loadStrings(context.player)
    },
    booleans (root, params, context) {
      return new PlayerRepository(context.db).loadBooleans(context.player)
    }
  },
  Query: {
    Load (root, params, context) {
      return context
    }
  },
  Mutation: {
    async Save (root, { integers, floats, booleans, strings }, context) {
      return new PlayerRepository(context.db).saveState(context.player, integers, floats, booleans, strings)
    }
  }
}
