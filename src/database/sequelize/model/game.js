const Sequelize = require('sequelize')

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
      allowNull: false,
      validate: {
        is: /^[0-9]+$/i
      }
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

  Game.prototype.getToken = function () {
    return this.appid + '|' + this.secret
  }

  Game.belongsTo(sequelize.Admin, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })

  return Game
}
