const LeaderboardRepository = require('../../data/leaderboardRepository')

exports.resolver = {
  Query: {
    async GlobalIntLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getInt(context.player.gameId, key, top, page)
    },
    async GlobalFloatLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getFloat(context.player.gameId, key, top, page)
    },
    async FriendsIntLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getIntFriends(context.player, key, top, page)
    },
    async FriendsFloatLeaderboard (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getFloatFriends(context.player, key, top, page)
    }
  }
}
