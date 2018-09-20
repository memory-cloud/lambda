const debug = require('debug')('database')
const Sequelize = require('sequelize')
const config = require('./config')[process.env.NODE_ENV]
const Model = require('../model')

class Database {
  constructor () {
    this.setup().then(() => {
      switch (process.env.NODE_ENV) {
        case 'development':
        case 'production':
          return this.createDatabase().then(() => this.sync(false))
      }
    })
  }

  async setup () {
    debug('setup')
    this.sequelize = new Sequelize({
      host: config.host,
      database: config.database,
      username: config.username,
      password: config.password,
      dialect: config.dialect,
      operatorsAliases: Sequelize.Op,
      pool: {
        max: 10,
        idle: 500
      },
      logging: process.env.DEBUG ? require('debug')('sequelize:logging') : false
    })

    this.sequelize.Admin = Model.get('Admin', this.sequelize)
    this.sequelize.Achievement = Model.get('Achievement', this.sequelize)
    this.sequelize.Game = Model.get('Game', this.sequelize)
    this.sequelize.Integer = Model.get('Integer', this.sequelize)
    this.sequelize.Float = Model.get('Float', this.sequelize)
    this.sequelize.Boolean = Model.get('Boolean', this.sequelize)
    this.sequelize.String = Model.get('String', this.sequelize)
    this.sequelize.Player = Model.get('Player', this.sequelize)
  }

  async sync (force) {
    debug('sync ' + force)
    return this.sequelize.sync({ force: force })
  }

  async close () {
    debug('close')
    return this.sequelize.connectionManager.close()
  }

  async createDatabase () {
    debug('create')
    const sequelize = new Sequelize(null, config.username, config.password, {
      dialect: 'mysql',
      host: config.host,
      logging: false,
      operatorsAliases: false
    })

    return sequelize.query('CREATE DATABASE IF NOT EXISTS ' + config.database + ';').then(() => sequelize.close())
  }

  async dropDatabase () {
    debug('drop')
    return this.sequelize.query('DROP DATABASE IF EXISTS ' + config.database + ';')
  }
}

module.exports = new Database()
