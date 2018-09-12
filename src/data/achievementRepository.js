const debug = require('debug')('repository:achievement')

class AchievementRepository {
  constructor (db) {
    if (!AchievementRepository.instance) {
      this.db = db
      this.Achievement = db.import('Achievement', require('../model/achievement'))
      this.Game = db.import('Game', require('../model/game'))
      AchievementRepository.instance = this
    }
    return AchievementRepository.instance
  }

  async completeAchievement (player, title) {
    try {
      const achievement = await this.Achievement.findOne({ where: { title: title, gameId: player.gameId }, attributes: ['id'] })

      if (!achievement) throw new Error('Achievement not found')

      await player.getAchievements().map(achiev => {
        if (achiev.id === achievement.id) throw new Error('Achievement already done')
      })
      player.addAchievement(achievement)
      return true
    } catch (err) {
      debug(err)
      return err
    }
  }

  async completedAchievementsByPlayer (player) {
    return player.getAchievements({ order: [
      ['createdAt', 'DESC']
    ] })
  }

  async createAchievement (admin, achievement) {
    try {
      const game = await this.Game.findOne({ where: { id: achievement.gameId, adminId: admin.id } })
      achievement.gameId = game.id
      return this.Achievement.create(achievement)
    } catch (err) {
      console.log(err)
      return err
    }
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
