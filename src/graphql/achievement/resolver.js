// const debug = require('debug')('achievement-resolver')
const AchievementRepository = require('../../data/achievementRepository')

exports.resolver = {
  Query: {
    async Achievements (db, params, context) {
      return new AchievementRepository(context.db).completedAchievementsByPlayer(context.player)
    }
  },
  Mutation: {
    async CompleteAchievement (db, { title }, context) {
      return new AchievementRepository(context.db).completeAchievement(context.player, title)
    }
  }
}
