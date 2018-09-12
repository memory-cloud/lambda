const Sequelize = require('sequelize')
// const debug = require('debug')('game-model')

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
        model: 'games'
      },
      unique: 'compositeIndex',
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['id', 'fbid', 'gameId']
    }] }
  )
  Player.belongsToMany(sequelize.import('./achievement'), { through: sequelize.define('achievements_player', {}) })
  return Player
}
