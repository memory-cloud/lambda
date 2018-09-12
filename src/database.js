// const debug = require('debug')('database')
const Sequelize = require('sequelize')
const config = require('./config')[process.env.NODE_ENV]

class Database {
  constructor () {
    if (!Database.instance) {
      if (process.env.INIT === 'true') {
        this.createDatabase()
      }

      this.sequelize = new Sequelize({
        host: config.host,
        database: config.database,
        username: config.username,
        password: config.password,
        dialect: config.dialect,
        operatorsAliases: Sequelize.Op,
        pool: {
          max: 1
        },
        logging: process.env.DEBUG ? require('debug')('sequelize:logging') : false
      })

      require('./model/admin')(this.sequelize)
      require('./model/game')(this.sequelize)
      require('./model/achievement')(this.sequelize)
      require('./model/player')(this.sequelize)
      require('./model/integer')(this.sequelize)
      require('./model/float')(this.sequelize)
      require('./model/boolean')(this.sequelize)
      require('./model/string')(this.sequelize)

      if (process.env.INIT === 'true') {
        this.sync(process.env.FORCE_SYNC === 'true')
      }
    }
    return Database.instance
  }

  async sync (force) {
    return this.sequelize.sync({ force: force })
  }

  async close () {
    return this.sequelize.connectionManager.close()
  }

  async createDatabase () {
    const sequelize = new Sequelize(null, config.username, config.password, {
      dialect: 'mysql',
      host: config.host,
      logging: false,
      operatorsAliases: false
    })

    return sequelize.query('CREATE DATABASE IF NOT EXISTS ' + config.database + ';').then(() => sequelize.close())
  }

  async dropDatabase () {
    return this.sequelize.query('DROP DATABASE IF EXISTS ' + config.database + ';')
  }
}

module.exports = new Database()
