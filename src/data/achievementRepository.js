const Repository = require('./repository')
const GameRepository = require('./gameRepository')

class AchievementRepository extends Repository {
  async completeAchievement (player, title) {
    const achievement = await this.db.Achievement.findOne({ where: { title: title, gameId: player.gameId }, attributes: ['id'] })

    if (!achievement) throw new Error('Achievement not found')

    await this.db.query(
      'INSERT INTO player_has_achievements (achievementId, playerId) ' +
      'VALUES (:achievementId, :playerId)',
      { replacements: { achievementId: achievement.id, playerId: player.id } })

    return true
  }

  async completedAchievementsByPlayer (player) {
    const achievements = await this.db.query(
      'SELECT achievements.image, achievements.title, achievements.description, player_has_achievements.createdAt AS completedAt ' +
      'FROM player_has_achievements ' +
      'JOIN achievements ON achievements.id = player_has_achievements.achievementId ' +
      'WHERE player_has_achievements.playerId = :playerId ' +
      'ORDER BY completedAt DESC',
      { replacements: { playerId: player.id } })
    return achievements[0]
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
    return this.db.Achievement.findAll({ where: { gameId: game.id } })
  }
}

module.exports = AchievementRepository
