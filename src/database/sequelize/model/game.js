const Sequelize = require('sequelize')

class Game extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        },
        allowNull: false
      },
      appid: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false,
        validate: {
          is: /^[0-9]+$/i
        }
      },
      secret: {
        type: DataTypes.STRING,
        validate: {
          len: [6, 255],
          notEmpty: true,
          is: /^[A-Za-z0-9-]+$/i
        },
        allowNull: false
      }
    }, {
      indexes: [{
        fields: ['appid']
      }, {
        fields: ['AdminId']
      }],
      sequelize
    })
  }

  static associate (models) {
    this.admin = this.belongsTo(models.Admin, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
  }

  getToken () {
    return this.appid + '|' + this.secret
  }
}

module.exports = Game
