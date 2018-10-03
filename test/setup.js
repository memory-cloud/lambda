const database = require('../src/database/sequelize')
const mongodb = require('../src/database/mongodb')
const redis = require('../src/database/redis')

const app = require('../src/app')
class Setup {
  static async setup () {
    let server = await app.listen()
    await database.createDatabase()
    await mongodb.createDatabase()
    return server
  }

  static async afterAll (server) {
    await server.close()
    await database.dropDatabase()
    await mongodb.dropDatabase()
    await mongodb.close()
    await redis.flush()
    await redis.close()
    return database.close()
  }

  static async beforeEach () {
    await database.sync(true)
    await redis.flush()
    return mongodb.createDatabase()
  }

  static async afterEach () {
    return mongodb.dropDatabase()
  }
}

module.exports = Setup
