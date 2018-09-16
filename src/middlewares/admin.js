const debug = require('debug')('admin-middleware')
const AdminRepository = require('../data/adminRepository')

module.exports = async (req, res, next) => {
  if (!req.headers.admin) return next()

  const credentials = req.headers.admin

  try {
    req.context.admin = await new AdminRepository(req.context.db).findByToken(credentials)

    if (!req.context.admin) return res.status(404).send('Admin not found')

    next()
  } catch (err) {
    debug(err)
    return res.status(401).send(err)
  }
}
