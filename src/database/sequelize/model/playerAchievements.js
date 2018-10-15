const Sequelize = require('sequelize')

class PlayerHasAchievements extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      completedAt: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    }, {
      indexes: [{
        fields: ['PlayerId', 'AchievementId']
      }],
      timestamps: false,
      sequelize
    })
  }
}

module.exports = PlayerHasAchievements
