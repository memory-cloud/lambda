const Sequelize = require('sequelize')

class Player extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      fbid: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
      }
    }, {
      indexes: [{
        fields: ['GameId']
      }, {
        fields: ['fbid']
      }],
      sequelize
    })
  }

  static associate (models) {
    this.game = this.belongsTo(models.Game, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
    this.achievements = this.belongsToMany(models.Achievement, {
      through: models.PlayerAchievement
    })
  }
}

module.exports = Player
