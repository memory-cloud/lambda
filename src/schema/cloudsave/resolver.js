const SaveState = require('../../service/player/saveState')
const LoadState = require('../../service/player/loadState')

exports.resolver = {
  State: {
    integers (_, params, { db, player }) {
      return new LoadState(db).integers(player)
    },
    floats (_, params, { db, player }) {
      return new LoadState(db).floats(player)
    },
    strings (_, params, { db, player }) {
      return new LoadState(db).strings(player)
    },
    booleans (_, params, { db, player }) {
      return new LoadState(db).booleans(player)
    },
    objects (_, params, { db, player }) {
      return new LoadState(db).objects(player)
    }
  },
  Query: {
    Load (_, params, context) {
      return context
    }
  },
  Mutation: {
    async Save (_, state, { db, player }) {
      return new SaveState(db).save(player, state)
    }
  }
}
