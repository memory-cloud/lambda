const Service = require('../service')
const { AchievementNotFoundError } = require('../../error')
class AchievementRepository extends Service {
  async completeAchievement (player, title) {
    const achievement = await this.db.sequelize.Achievement.findOne({ where: { title: title, gameId: player.gameId } })
    if (!achievement) throw new AchievementNotFoundError()
    await this.db.sequelize.query(
      `INSERT INTO player_has_achievements (achievementId, playerId)
      VALUES (:achievementId, :playerId)`,
      { replacements: { achievementId: achievement.id, playerId: player.id } })
    return achievement
  }

  async getAchievementsByPlayer (player) {
    const achievements = await this.db.sequelize.query(
      `SELECT a.image, a.title, a.description, pa.createdAt AS completedAt
      FROM achievements a
      LEFT JOIN player_has_achievements pa ON (pa.achievementId = a.id AND pa.playerId = :playerId)
      WHERE a.gameId = :gameId
      ORDER BY completedAt DESC`,
      { replacements: { playerId: player.id, gameId: player.gameId } })
    return achievements[0]
  }
}

module.exports = AchievementRepository
