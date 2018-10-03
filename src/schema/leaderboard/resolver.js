// const Leaderboard = require('../../service/player/leaderboard')
const LeaderboardSQL = require('../../service/player/leaderboard')

exports.resolver = {
  Query: {
    async GlobalIntLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardSQL(context.db).GlobalIntLeaderboard(context.player, key, top, page)
    },
    async GlobalFloatLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardSQL(context.db).GlobalFloatLeaderboard(context.player, key, top, page)
    },
    async FriendsIntLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardSQL(context.db).FriendsIntLeaderboard(context.player, key, top, page)
    },
    async FriendsFloatLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardSQL(context.db).FriendsFloatLeaderboard(context.player, key, top, page)
    },
    async GlobalIntPosition (root, { key }, context) {
      return new LeaderboardSQL(context.db).GlobalIntPosition(context.player, key)
    },
    async GlobalFloatPosition (root, { key }, context) {
      return new LeaderboardSQL(context.db).GlobalFloatPosition(context.player, key)
    },
    async FriendsIntPosition (root, { key }, context) {
      return new LeaderboardSQL(context.db).FriendsIntPosition(context.player, key)
    },
    async FriendsFloatPosition (root, { key }, context) {
      return new LeaderboardSQL(context.db).FriendsFloatPosition(context.player, key)
    }
  }
}
