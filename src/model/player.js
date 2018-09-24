const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Player = sequelize.define('player', {
    fbid: {
      type: Sequelize.BIGINT,
      allowNull: false,
      unique: 'compositeIndex'
    },
    gameId: {
      type: Sequelize.INTEGER,
      references: {
        model: sequelize.Game
      },
      unique: 'compositeIndex',
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['id', 'fbid', 'gameId']
    }] }
  )
  Player.belongsToMany(sequelize.Achievement, {
    through: sequelize.define('player_has_achievements', {
      createdAt: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.STRING,
        defaultValue: null,
        allowNull: true
      }
    })
  })
  return Player
}
