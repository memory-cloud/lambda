const Sequelize = require('sequelize')
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
  const Admin = sequelize.define('admin', {
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
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
      fields: ['id', 'password', 'email']
    }]
  })

  Admin.prototype.validPassword = async function (password) {
    if (!await bcrypt.compare(password, this.password)) {
      throw new Error('Wrong credentials')
    }
    return true
  }

  return Admin
}
