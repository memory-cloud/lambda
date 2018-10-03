const Leaderboard = require('../../service/player/leaderboard')
const Position = require('../../service/player/position')

exports.resolver = {
  Query: {
    async GlobalIntLeaderboard (_, { top, key, page }, { db, player }) {
      return new Leaderboard(db).GlobalIntLeaderboard(player, key, top, page)
    },
    async GlobalFloatLeaderboard (_, { top, key, page }, { db, player }) {
      return new Leaderboard(db).GlobalFloatLeaderboard(player, key, top, page)
    },
    async FriendsIntLeaderboard (_, { top, key, page }, { db, player }) {
      return new Leaderboard(db).FriendsIntLeaderboard(player, key, top, page)
    },
    async FriendsFloatLeaderboard (_, { top, key, page }, { db, player }) {
      return new Leaderboard(db).FriendsFloatLeaderboard(player, key, top, page)
    },
    async GlobalIntPosition (_, { key }, { db, player }) {
      return new Position(db).GlobalIntPosition(player, key)
    },
    async GlobalFloatPosition (_, { key }, { db, player }) {
      return new Position(db).GlobalFloatPosition(player, key)
    },
    async FriendsIntPosition (_, { key }, { db, player }) {
      return new Position(db).FriendsIntPosition(player, key)
    },
    async FriendsFloatPosition (_, { key }, { db, player }) {
      return new Position(db).FriendsFloatPosition(player, key)
    }
  }
}
