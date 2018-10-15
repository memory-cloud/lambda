const Service = require('../service')
const { AchievementNotFoundError } = require('../../error')
class AchievementRepository extends Service {
  async completeAchievement (player, title) {
    const achievement = await this.db.sequelize.Achievement.findOne({ where: { title: title, GameId: player.GameId } })
    if (!achievement) throw new AchievementNotFoundError()
    await this.db.sequelize.query(
      `INSERT INTO PlayerHasAchievements (AchievementId, PlayerId)
      VALUES (:AchievementId, :PlayerId)`,
      { replacements: { AchievementId: achievement.id, PlayerId: player.id } })
    return achievement
  }

  async getAchievementsByPlayer (player) {
    const achievements = await this.db.sequelize.query(
      `SELECT a.image, a.title, a.description, pa.createdAt AS completedAt
      FROM Achievements a
      LEFT JOIN PlayerHasAchievements pa ON (pa.AchievementId = a.id AND pa.PlayerId = :PlayerId)
      WHERE a.GameId = :GameId
      ORDER BY completedAt DESC`,
      { replacements: { PlayerId: player.id, GameId: player.GameId } })
    return achievements[0]
  }
}

module.exports = AchievementRepository
