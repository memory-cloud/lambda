const database = require('../src/database/sequelize')
const mongodb = require('../src/database/mongodb')
const app = require('../src/app')

class Setup {
  static async setup () {
    let server = await app.listen()
    await database.createDatabase()
    await mongodb.createDatabase()
    return server
  }

  static async teardown (server) {
    await server.close()
    await database.dropDatabase()
    await mongodb.dropDatabase()
    await mongodb.close()
    return database.close()
  }

  static async beforeEach () {
    await database.sync(true)
    return mongodb.createDatabase()

  }

  static async afterEach () {
    await mongodb.dropDatabase()
  }
}

module.exports = Setup
