const Sequelize = require('sequelize')

class Integer extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      key: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        },
        index: true,
        allowNull: false
      },
      value: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    }, {
      indexes: [{
        fields: ['PlayerId']
      }, {
        fields: ['key']
      }, {
        fields: ['PlayerId', 'key'],
        unique: true
      }],
      sequelize
    })
  }

  static associate (models) {
    this.player = this.belongsTo(models.Player, { foreignKey: { allowNull: false }, onDelete: 'CASCADE' })
  }
}

module.exports = Integer
