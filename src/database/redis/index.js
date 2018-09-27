const redis = require('redis')
const config = require('../../config/redis')[process.env.NODE_ENV]
const debug = require('debug')('database:redis')
const util = require('util')

class RedisDatabase {
  constructor () {
    this.setup()
  }

  async setup () {
    debug('setup')
    this.redis = await redis.createClient(config.url)
    this.redis.get = util.promisify(this.redis.get).bind(this.redis)
  }

  async close () {
    return this.redis.end(true)
  }

  async flush () {
    return this.redis.flushdb()
  }
}

module.exports = new RedisDatabase()
