const MongoClient = require('mongodb').MongoClient
const config = require('../../config/mongodb')[process.env.NODE_ENV]
const debug = require('debug')('database:mongodb')

class DatabaseMongo {
  constructor () {
    this.setup().then(() => {
      switch (process.env.NODE_ENV) {
        case 'development':
        case 'production':
          return this.createDatabase()
      }
    })
  }

  async setup () {
    debug('setup')
    const options = {
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
      reconnectInterval: 500, // Reconnect every 500ms
      poolSize: 10, // Maintain up to 10 socket connections
      // If not connected, return errors immediately rather than waiting for reconnect
      bufferMaxEntries: 0,
      useNewUrlParser: true
    }
    this.client = await MongoClient.connect(config.uri, options)
  }

  async createDatabase () {
    debug('create')
    this.mongodb = await this.client.db(config.database)
  }

  async dropDatabase () {
    debug('drop')
    return this.mongodb.dropDatabase(config.database)
  }

  async close () {
    debug('close')
    return this.client.close()
  }
}

module.exports = new DatabaseMongo()
