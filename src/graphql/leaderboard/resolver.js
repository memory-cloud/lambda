// const debug = require('debug')('leaderboard-resolver')

const LeaderboardRepository = require('../../data/leaderboardRepository')

exports.resolver = {
  Query: {
    Leaderboard (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getInt(context.player.gameId, key, top, page)
    },
    async LeaderboardFloat (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getFloat(context.player, key, top, page)
    },
    async LeaderboardFriends (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getIntFriends(context.player, key, top, page)
    },
    async LeaderboardFloatFriends (root, { top, key, page }, context) {
      return new LeaderboardRepository(context.db).getFloatFriends(context.player, key, top, page)
    }
  }
}
