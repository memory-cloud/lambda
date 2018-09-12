const Sequelize = require('sequelize')
// const debug = require('debug')('game-model')

module.exports = (sequelize) => {
  const Boolean = sequelize.define('boolean', {
    key: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      unique: 'compositeIndex',
      allowNull: false
    },
    value: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    playerId: {
      type: Sequelize.INTEGER,
      references: {
        model: sequelize.import('./player')
      },
      unique: 'compositeIndex',
      allowNull: false
    }
  })
  return Boolean
}
