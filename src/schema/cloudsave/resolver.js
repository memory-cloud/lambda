const State = require('../../service/player/state')

exports.resolver = {
  State: {
    integers (root, params, context) {
      return new State(context.db).loadIntegers(context.player)
    },
    floats (root, params, context) {
      return new State(context.db).loadFloats(context.player)
    },
    strings (root, params, context) {
      return new State(context.db).loadStrings(context.player)
    },
    booleans (root, params, context) {
      return new State(context.db).loadBooleans(context.player)
    },
    objects (root, params, context) {
      return new State(context.db).loadObjects(context.player)
    }
  },
  Query: {
    Load (root, params, context) {
      return context
    }
  },
  Mutation: {
    async Save (root, state, context) {
      return new State(context.db).save(context.player, state)
    }
  }
}
