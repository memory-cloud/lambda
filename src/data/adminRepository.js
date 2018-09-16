// const debug = require('debug')('repository:admin')
const jwt = require('jsonwebtoken')
const jwtdecode = require('jwt-decode')
const Repository = require('./repository')

class AdminRepository extends Repository {
  async findByToken (token) {
    const payload = jwtdecode(token)

    if (payload.exp < Date.now()) throw new Error('Token expired')

    let admin = await this.db.Admin.findOne({ where: { id: payload.id }, attributes: ['password', 'id'] })

    if (!admin) throw new Error('Admin not found')

    await jwt.verify(token, admin.password)

    return admin
  }

  async me (admin) {
    return this.db.Admin.findById(admin.id)
  }
}

module.exports = AdminRepository
