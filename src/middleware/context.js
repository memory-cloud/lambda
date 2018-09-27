const database = require('../database/sequelize')
const mongo = require('../database/mongodb')
const redis = require('../database/redis')

module.exports = (req, res, next) => {
  req.context = {}
  req.context.db = database.sequelize
  req.context.mongo = mongo.mongodb
  req.context.redis = redis.redis
  next()
}
