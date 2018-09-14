const debug = require('debug')('repository:auth')
const jwt = require('jsonwebtoken')

class AuthRepository {
  constructor (db) {
    if (!AuthRepository.instance) {
      this.db = db
      this.Admin = db.import('Admin', require('../model/admin'))
      AuthRepository.instance = this
    }
    return AuthRepository.instance
  }

  async login (email, password) {
    try {
      var admin = await this.Admin.findOne({ where: { email: email }, attributes: ['id', 'password'] })

      if (!admin) {
        throw new Error('Wrong credentials')
      }

      await admin.validPassword(password)
      return jwt.sign(getPayload(admin, 1), admin.password)
    } catch (err) {
      return err
    }
  }

  async register (email, password) {
    try {
      if (process.env.OPEN === 'false') throw new Error('Registration is closed')

      const admin = await this.Admin.create({ email: email, password: password })

      return jwt.sign(getPayload(admin, 1), admin.password)
    } catch (err) {
      debug(err)
      return err
    }
  }

  async changePassword (admin, oldPassword, newPassword) {
    try {
      await admin.validPassword(oldPassword)
      admin.password = newPassword
      await admin.save()
      return true
    } catch (err) {
      debug(err)
      return err
    }
  }
}

const getPayload = function (admin, days) {
  const payload = {}
  payload.id = admin.id
  payload.exp = Date.now() + 1000 * 60 * 60 * 24 * days
  return payload
}

module.exports = AuthRepository
