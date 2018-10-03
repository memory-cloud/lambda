const Leaderboard = require('../../service/player/leaderboard')
const Position = require('../../service/player/position')

exports.resolver = {
  Query: {
    async GlobalIntLeaderboard (root, { top, key, page }, context) {
      return new Leaderboard(context.db).GlobalIntLeaderboard(context.player, key, top, page)
    },
    async GlobalFloatLeaderboard (root, { top, key, page }, context) {
      return new Leaderboard(context.db).GlobalFloatLeaderboard(context.player, key, top, page)
    },
    async FriendsIntLeaderboard (root, { top, key, page }, context) {
      return new Leaderboard(context.db).FriendsIntLeaderboard(context.player, key, top, page)
    },
    async FriendsFloatLeaderboard (root, { top, key, page }, context) {
      return new Leaderboard(context.db).FriendsFloatLeaderboard(context.player, key, top, page)
    },
    async GlobalIntPosition (root, { key }, context) {
      return new Position(context.db).GlobalIntPosition(context.player, key)
    },
    async GlobalFloatPosition (root, { key }, context) {
      return new Position(context.db).GlobalFloatPosition(context.player, key)
    },
    async FriendsIntPosition (root, { key }, context) {
      return new Position(context.db).FriendsIntPosition(context.player, key)
    },
    async FriendsFloatPosition (root, { key }, context) {
      return new Position(context.db).FriendsFloatPosition(context.player, key)
    }
  }
}
