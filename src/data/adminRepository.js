const debug = require('debug')('repository:admin')
const jwt = require('jsonwebtoken')
const jwtdecode = require('jwt-decode')

class AdminRepository {
  constructor (db) {
    if (!AdminRepository.instance) {
      this.db = db
      this.Admin = db.import('Admin', require('../model/admin'))
      AdminRepository.instance = this
    }
    return AdminRepository.instance
  }

  async findByToken (token) {
    try {
      const payload = jwtdecode(token)

      if (payload.exp < Date.now()) throw new Error('Token expired')

      let admin = await this.Admin.findOne({ where: { id: payload.id }, attributes: ['password', 'id'] })

      if (!admin) return null

      if (await jwt.verify(token, admin.password)) return admin
    } catch (err) {
      debug(err)
      return null
    }
  }

  async me (admin) {
    return this.Admin.findById(admin.id)
  }
}

module.exports = AdminRepository
