const StateCollection = require('../../database/mongodb/collection/state')

exports.resolver = {
  Query: {
    Load (root, params, context) {
      return new StateCollection(context.mongo).Load(context.player)
    }
  },
  Mutation: {
    async Save (root, state, context) {
      return new StateCollection(context.mongo).Save(context.player, state)
    }
  }
}
