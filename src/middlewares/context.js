// const debug = require('debug')('middleware:context')
const database = require('../database')
// const path = require('path')

module.exports = (req, res, next) => {
  req.context = {}
  req.context.db = database.sequelize
  next()
}
