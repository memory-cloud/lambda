const Service = require('../service')
const GameRepository = require('./gameRepository')
const { AchievementNotFoundError } = require('../../error')
class AchievementRepository extends Service {
  async createAchievement (admin, achievement) {
    const game = await new GameRepository(this.db).game(admin, achievement.gameId)
    achievement.gameId = game.id
    return this.db.sequelize.Achievement.create(achievement)
  }

  async updateAchievement (admin, achievement) {
    await this.readAchievement(admin, achievement.id)
    await this.db.sequelize.Achievement.update(achievement, { where: { id: achievement.id } })
    return achievement
  }

  async readAchievement (admin, id) {
    const achievement = await this.db.sequelize.Achievement.findOne({ where: { id: id } })
    if (!achievement) throw new AchievementNotFoundError()
    await new GameRepository(this.db).game(admin, achievement.gameId)
    return achievement
  }

  async deleteAchievement (admin, id) {
    const achievement = await this.readAchievement(admin, id)
    await this.db.sequelize.Achievement.destroy({ where: { id: achievement.id } })
    return true
  }

  async findByGame (game) {
    return this.db.sequelize.Achievement.findAll({ where: { gameId: game.id } })
  }
}

module.exports = AchievementRepository
