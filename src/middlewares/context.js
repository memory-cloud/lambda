const database = require('../database/database')

module.exports = (req, res, next) => {
  req.context = {}
  req.context.db = database.sequelize
  next()
}
