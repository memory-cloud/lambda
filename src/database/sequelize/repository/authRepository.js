// const debug = require('debug')('repository:auth')
const jwt = require('jsonwebtoken')
const Repository = require('./repository')
// const SendVerificationEmail = require('service/sendgrid')
// const crypto = require('crypto')
const { WrongCredentialsError } = require('../../../error')

class AuthRepository extends Repository {
  async login (email, password) {
    const admin = await this.db.Admin.findOne({ where: { email: email }, attributes: ['id', 'password'] })
    if (!admin) throw new WrongCredentialsError()
    await admin.validPassword(password)
    return jwt.sign(getPayload(admin), admin.password)
  }

  async register (email, password) {
    if (process.env.OPEN === 'false') throw new Error('Registration is closed')
    const admin = await this.db.Admin.create({ email: email, password: password })
    // const admin = await this.db.Admin.create({ email: email, password: password, verification: crypto.randomBytes(32).toString('base64') })
    // await SendVerificationEmail(admin)
    return jwt.sign(getPayload(admin), admin.password)
  }

  async changePassword (admin, oldPassword, newPassword) {
    await admin.validPassword(oldPassword)
    admin.password = newPassword
    await admin.save()
    return true
  }

  // async confirm (email, confirmation) {
  //   const admin = await this.db.Admin.findOne({ where: { email: email, verification: confirmation } })
  //   if (!admin) throw new Error('Not match')
  //   admin.verification = null
  //   return admin.save
  // }
}

const getPayload = function (admin, days = 1) {
  const payload = {}
  payload.id = admin.id
  payload.exp = Date.now() + 1000 * 60 * 60 * 24 * days
  return payload
}

module.exports = AuthRepository
