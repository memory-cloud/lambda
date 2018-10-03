const AchievementRepository = require('../../service/player/achievementRepository')

exports.resolver = {
  Query: {
    async Achievements (_, params, { db, player }) {
      return new AchievementRepository(db).getAchievementsByPlayer(player)
    }
  },
  Mutation: {
    async CompleteAchievement (_, { title }, { db, player }) {
      return new AchievementRepository(db).completeAchievement(player, title)
    }
  }
}
