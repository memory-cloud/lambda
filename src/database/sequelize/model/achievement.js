const Sequelize = require('sequelize')

class Achievement extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      title: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        },
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          is: /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|png)+$/i
        }
      }
    }, {
      indexes: [{
        fields: ['title', 'GameId'],
        unique: true
      }, {
        fields: ['title']
      }, {
        fields: ['GameId']
      }],
      sequelize
    })
  }

  static associate (models) {
    this.game = this.belongsTo(models.Game, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
  }
}

module.exports = Achievement
