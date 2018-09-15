const Sequelize = require('sequelize')
// const debug = require('debug')('game-model')

module.exports = (sequelize) => {
  const Achievement = sequelize.define('achievement', {
    title: {
      type: Sequelize.STRING,
      validate: {
        notEmpty: true
      },
      unique: 'compositeIndex',
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    gameId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'games'
      },
      unique: 'compositeIndex',
      allowNull: false
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)+$/i
      }
    }
  })
  return Achievement
}
