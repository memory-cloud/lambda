const Sequelize = require('sequelize')

class PlayerHasAchievements extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({}, {
      indexes: [{
        fields: ['PlayerId', 'AchievementId']
      }],
      sequelize
    })
  }
}

module.exports = PlayerHasAchievements
