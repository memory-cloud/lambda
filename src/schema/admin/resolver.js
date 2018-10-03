const AdminRepository = require('../../service/admin/adminRepository')
const GameRepository = require('../../service/admin/gameRepository')
const AchievementRepository = require('../../service/admin/achievementRepository')

exports.resolver = {
  Game: {
    async achievements (game, _, { db }) {
      return new AchievementRepository(db).findByGame(game)
    },
    async players (game, _, { db }) {
      return new GameRepository(db).playersCount(game)
    }
  },
  Query: {
    me (_, args, { db, admin }) {
      return new AdminRepository(db).me(admin)
    },
    async games (_, args, { db, admin }) {
      return new GameRepository(db).games(admin)
    },
    game (_, { id }, { db, admin }) {
      return new GameRepository(db).game(admin, id)
    },
    async readAchievement (_, { id }, { db, admin }) {
      return new AchievementRepository(db).readAchievement(admin, id)
    }
  },
  Mutation: {
    async createGame (_, { game }, { db, admin }) {
      return new GameRepository(db).createGame(admin, game)
    },
    async createAchievement (_, { achievement }, { db, admin }) {
      return new AchievementRepository(db).createAchievement(admin, achievement)
    },
    async updateAchievement (_, { achievement }, { db, admin }) {
      return new AchievementRepository(db).updateAchievement(admin, achievement)
    },
    async deleteAchievement (_, { id }, { db, admin }) {
      return new AchievementRepository(db).deleteAchievement(admin, id)
    }

  }
}
