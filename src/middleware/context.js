const database = require('../database/sequelize')
const mongo = require('../database/mongodb')

module.exports = (req, res, next) => {
  req.context = {}
  req.context.db = database.sequelize
  req.context.mongo = mongo.mongodb
  next()
}
