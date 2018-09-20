const AdminRepository = require('../../data/adminRepository')
const GameRepository = require('../../data/gameRepository')
const AchievementRepository = require('../../data/achievementRepository')

exports.resolver = {
  Game: {
    async achievements (game, _, context) {
      return new AchievementRepository(context.db).findByGame(game)
    },
    async players (game, _, context) {
      return new GameRepository(context.db).playersCount(game)
    }
  },
  Query: {
    me (_, args, context) {
      return new AdminRepository(context.db).me(context.admin)
    },
    async games (_, args, context) {
      return new GameRepository(context.db).games(context.admin)
    },
    game (_, { id }, context) {
      return new GameRepository(context.db).game(context.admin, id)
    },
    async readAchievement (_, { id }, context) {
      return new AchievementRepository(context.db).readAchievement(context.admin, id)
    }
  },
  Mutation: {
    async createGame (_, { game }, context) {
      return new GameRepository(context.db).createGame(context.admin, game)
    },
    async createAchievement (_, { achievement }, context) {
      return new AchievementRepository(context.db).createAchievement(context.admin, achievement)
    },
    async updateAchievement (_, { achievement }, context) {
      return new AchievementRepository(context.db).updateAchievement(context.admin, achievement)
    },
    async deleteAchievement (_, { id }, context) {
      return new AchievementRepository(context.db).deleteAchievement(context.admin, id)
    }

  }
}
