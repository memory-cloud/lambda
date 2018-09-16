const Repository = require('./repository')
const GameRepository = require('./gameRepository')

class AchievementRepository extends Repository {
  async completeAchievement (player, title) {
    const achievement = await this.db.Achievement.findOne({ where: { title: title, gameId: player.gameId }, attributes: ['id'] })

    if (!achievement) throw new Error('Achievement not found')

    await player.getAchievements().map(achiev => {
      if (achiev.id === achievement.id) throw new Error('Achievement already done')
    })
    player.addAchievement(achievement)
    return true
  }

  async completedAchievementsByPlayer (player) {
    return player.getAchievements({ order: [
      ['createdAt', 'DESC']
    ] })
  }

  async createAchievement (admin, achievement) {
    const game = await new GameRepository(this.db).game(admin, achievement.gameId)

    achievement.gameId = game.id

    return this.db.Achievement.create(achievement)
  }

  async updateAchievement (admin, achievement) {
    await this.readAchievement(admin, achievement.id)

    await this.db.Achievement.update(achievement, { where: { id: achievement.id } })

    return achievement
  }

  async readAchievement (admin, id) {
    const achievement = await this.db.Achievement.findOne({ where: { id: id } })

    if (!achievement) throw new Error('Achievement not found')

    await new GameRepository(this.db).game(admin, achievement.gameId)

    return achievement
  }

  async deleteAchievement (admin, id) {
    const achievement = await this.readAchievement(admin, id)

    await this.db.Achievement.destroy({ where: { id: achievement.id } })

    return true
  }

  async findByGame (game) {
    const achievements = await this.db.query(
      'SELECT * FROM achievements ' +
      'WHERE achievements.gameId = :gameId',
      { replacements: { gameId: game.id } }
    )
    return achievements[0]
  }
}

module.exports = AchievementRepository
