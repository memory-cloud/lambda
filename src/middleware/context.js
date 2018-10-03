const database = require('../database/sequelize')
const mongo = require('../database/mongodb')
const redis = require('../database/redis')

module.exports = (req, res, next) => {
  req.context = {}
  req.context.db = {}
  req.context.db.sequelize = database.sequelize
  req.context.db.mongodb = mongo.mongodb
  req.context.db.redis = redis.redis
  next()
}
