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
    this.redis.select(config.db)
    this.redis.get = util.promisify(this.redis.get).bind(this.redis)

    this.redis.getId = async (id) => {
      const response = await this.redis.get(id)
      if (!response) throw new Error('Cache not found')
      debug(`${id} from cache`)
      return JSON.parse(response)
    }
  }

  async close () {
    return this.redis.end(true)
  }

  async flush () {
    return this.redis.flushdb()
  }
}

module.exports = new RedisDatabase()
