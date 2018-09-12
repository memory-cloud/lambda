const Sequelize = require('sequelize')
// const debug = require('debug')('game-model')

module.exports = (sequelize) => {
  const Float = sequelize.define('float', {
    key: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      unique: 'compositeIndex',
      allowNull: false
    },
    value: {
      type: Sequelize.DECIMAL(10, 2),
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
  }, {
    indexes: [{
      fields: ['playerId', 'key', 'value']
    }]
  })
  return Float
}