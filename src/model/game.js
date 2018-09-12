const Sequelize = require('sequelize')
// const debug = require('debug')('game-model')

module.exports = (sequelize) => {
  const Game = sequelize.define('game', {
    name: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      allowNull: false
    },
    appid: {
      type: Sequelize.BIGINT,
      unique: true,
      allowNull: false
    },
    secret: {
      type: Sequelize.STRING,
      validate: {
        len: [6, 255],
        notEmpty: true,
        is: /^[A-Za-z0-9-]+$/i
      },
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['id', 'appid', 'secret']
    }]
  })

  Game.belongsTo(sequelize.import('./admin'), { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

  return Game
}
