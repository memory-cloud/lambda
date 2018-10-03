const SaveState = require('../../service/player/saveState')
const LoadState = require('../../service/player/loadState')

exports.resolver = {
  State: {
    integers (root, params, context) {
      return new LoadState(context.db).integers(context.player)
    },
    floats (root, params, context) {
      return new LoadState(context.db).floats(context.player)
    },
    strings (root, params, context) {
      return new LoadState(context.db).strings(context.player)
    },
    booleans (root, params, context) {
      return new LoadState(context.db).booleans(context.player)
    },
    objects (root, params, context) {
      return new LoadState(context.db).objects(context.player)
    }
  },
  Query: {
    Load (root, params, context) {
      return context
    }
  },
  Mutation: {
    async Save (root, state, context) {
      return new SaveState(context.db).save(context.player, state)
    }
  }
}
