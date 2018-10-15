const Sequelize = require('sequelize')

class Float extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      key: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        },
        allowNull: false
      },
      value: {
        type: DataTypes.DECIMAL(10, 2),
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

module.exports = Float
