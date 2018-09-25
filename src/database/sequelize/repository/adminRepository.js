// const debug = require('debug')('repository:admin')
const jwt = require('jsonwebtoken')
const jwtdecode = require('jwt-decode')
const Repository = require('./repository')
const { AdminNotFoundError, TokenExpiredError } = require('../../../error')

class AdminRepository extends Repository {
  async findByToken (token) {
    const admin = await this.db.Admin.findOne({ where: { id: verify(token) }, attributes: ['password', 'id'] })
    if (!admin) throw new AdminNotFoundError()
    await jwt.verify(token, admin.password)
    return admin
  }

  async me (admin) {
    admin = await this.db.Admin.findById(admin.id)
    if (!admin) throw new AdminNotFoundError()
    return admin
  }
}

const verify = (token) => {
  const payload = jwtdecode(token)
  if (payload.exp < Date.now()) throw new TokenExpiredError()
  return payload.id
}

module.exports = AdminRepository
