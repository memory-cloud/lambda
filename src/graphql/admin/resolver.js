// const debug = require('debug')('admin-resolver')
const AdminRepository = require('../../data/adminRepository')
const GameRepository = require('../../data/gameRepository')
const AchievementRepository = require('../../data/achievementRepository')

exports.resolver = {
  Game: {
    async achievements (game, _, context) {
      return new AchievementRepository(context.db).findByGame(game)
    },
    async players (game, _, context) {
      const players = await context.db.query(
        'SELECT COUNT(*) FROM players WHERE gameId = :gameId',
        { replacements: { gameId: game.id } }
      )
      return players[0][0]['COUNT(*)']
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
    }
  },
  Mutation: {
    async createGame (_, { game }, context) {
      return new GameRepository(context.db).createGame(context.admin, game)
    },
    async createAchievement (_, { achievement }, context) {
      return new AchievementRepository(context.db).createAchievement(context.admin, achievement)
    },
    async updateAchievement (_, { achievement, id }, context) {
      context.db.Achievement.create()
    }
  }
}
