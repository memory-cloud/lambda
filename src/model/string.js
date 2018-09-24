const Sequelize = require('sequelize')

module.exports = (sequelize) => {
  const String = sequelize.define('string', {
    key: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      unique: 'compositeIndex',
      allowNull: false
    },
    value: {
      type: Sequelize.STRING,
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
  })
  return String
}
