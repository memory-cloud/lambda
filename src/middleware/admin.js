const debug = require('debug')('middleware:admin')
const AdminRepository = require('../service/admin/adminRepository')

module.exports = async (req, res, next) => {
  if (!req.headers.admin) return next()

  const credentials = req.headers.admin

  try {
    req.context.admin = await new AdminRepository(req.context.db).findByToken(credentials)
    next()
  } catch (err) {
    debug(err)
    res.status(401).send(err)
  }
}
