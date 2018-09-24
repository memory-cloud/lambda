const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const Integer = sequelize.define('integer', {
    key: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      unique: 'compositeIndex',
      allowNull: false
    },
    value: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    playerId: {
      type: Sequelize.INTEGER,
      references: {
        model: sequelize.Player
      },
      unique: 'compositeIndex',
      allowNull: false
    }
  }, {
    indexes: [{
      fields: ['playerId', 'key', 'value']
    }]
  })
  return Integer
}
