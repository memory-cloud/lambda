const AchievementRepository = require('../../service/player/achievementRepository')

exports.resolver = {
  Query: {
    async Achievements (db, params, context) {
      return new AchievementRepository(context.db).getAchievementsByPlayer(context.player)
    }
  },
  Mutation: {
    async CompleteAchievement (db, { title }, context) {
      return new AchievementRepository(context.db).completeAchievement(context.player, title)
    }
  }
}
