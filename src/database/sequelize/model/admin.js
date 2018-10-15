const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

class Admin extends Sequelize.Model {
  static init (sequelize, DataTypes) {
    return super.init({
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invalid email'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: [6, 255]
        }
      }
    }, {
      hooks: {
        beforeSave: async (admin, options) => {
          let salt = await bcrypt.genSalt(10)
          admin.password = await bcrypt.hash(admin.password, salt)
        }
      },
      indexes: [{
        fields: ['email']
      }],
      sequelize
    })
  }

  async validPassword (password) {
    if (!await bcrypt.compare(password, this.password)) {
      throw new Error('Wrong credentials')
    }
    return true
  }
}

module.exports = Admin
