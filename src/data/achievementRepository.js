const debug = require('debug')('repository:achievement')
const Repository = require('./repository')

class AchievementRepository extends Repository {
  async completeAchievement (player, title) {
    try {
      const achievement = await this.db.Achievement.findOne({ where: { title: title, gameId: player.gameId }, attributes: ['id'] })

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
      const game = await this.db.Game.findOne({ where: { id: achievement.gameId, adminId: admin.id } })

      if (!game) throw new Error('Game not found')

      achievement.gameId = game.id
      return this.db.Achievement.create(achievement)
    } catch (err) {
      debug(err)
      return err
    }
  }

  async updateAchievement (admin, achievement) {
    try {
      await this.readAchievement(admin, achievement.id)

      await this.db.Achievement.update(achievement, { where: { id: achievement.id } })

      return achievement
    } catch (err) {
      debug(err)
      return err
    }
  }

  async readAchievement (admin, id) {
    try {
      const achievement = await this.db.Achievement.findOne({ where: { id: id } })

      if (!achievement) throw new Error('Achievement not found')

      const game = await this.db.Game.findOne({ where: { id: achievement.gameId, adminId: admin.id } })

      if (!game) throw new Error('Game not found')

      return achievement
    } catch (err) {
      debug(err)
      return err
    }
  }

  async deleteAchievement (admin, id) {
    try {
      const achievement = await this.readAchievement(admin, id)

      await this.db.Achievement.destroy({ where: { id: achievement.id } })

      return true
    } catch (err) {
      debug(err)
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
