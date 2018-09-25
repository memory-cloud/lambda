const StateCollection = require('../../database/mongodb/collection/state')

exports.resolver = {
  Query: {
    async GlobalIntLeaderboard (root, { top, key, page }, context) {
      return new StateCollection(context.mongo).GlobalIntLeaderboard(context.player, key, top, page)
    },
    async GlobalFloatLeaderboard (root, { top, key, page }, context) {
      return new StateCollection(context.mongo).GlobalFloatLeaderboard(context.player, key, top, page)
    },
    async FriendsIntLeaderboard (root, { top, key, page }, context) {
      return new StateCollection(context.mongo).FriendsIntLeaderboard(context.player, key, top, page)
    },
    async FriendsFloatLeaderboard (root, { top, key, page }, context) {
      return new StateCollection(context.mongo).FriendsFloatLeaderboard(context.player, key, top, page)
    }
  }
}
