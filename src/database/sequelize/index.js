const debug = require('debug')('database:sequelize')
const Sequelize = require('sequelize')
const config = require('../../config/sequelize')[process.env.NODE_ENV]
const Achievement = require('./model/achievement')
const Player = require('./model/player')
const Admin = require('./model/admin')
const Game = require('./model/game')
const Float = require('./model/float')
const Integer = require('./model/integer')
const PlayerAchievement = require('./model/playerAchievements')

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
      dialectOptions: {
        multipleStatements: true
      },
      pool: {
        max: 10,
        idle: 500
      },
      logging: process.env.DEBUG ? require('debug')('sequelize:logging') : false
    })

    const models = {
      Achievement: Achievement.init(this.sequelize, Sequelize),
      Admin: Admin.init(this.sequelize, Sequelize),
      Game: Game.init(this.sequelize, Sequelize),
      Player: Player.init(this.sequelize, Sequelize),
      Float: Float.init(this.sequelize, Sequelize),
      Integer: Integer.init(this.sequelize, Sequelize),
      PlayerAchievement: PlayerAchievement.init(this.sequelize, Sequelize)
    }

    // Run `.associate` if it exists,
    // ie create relationships in the ORM
    Object.values(models)
      .filter(model => typeof model.associate === 'function')
      .forEach(model => model.associate(models))

    this.sequelize.Achievement = models.Achievement
    this.sequelize.Admin = models.Admin
    this.sequelize.Game = models.Game
    this.sequelize.Player = models.Player
    this.sequelize.Float = models.Float
    this.sequelize.Integer = models.Integer
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
      logging: process.env.DEBUG ? require('debug')('sequelize:create-db') : false,
      operatorsAliases: false
    })

    return sequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`).then(() => sequelize.close())
  }

  async dropDatabase () {
    debug('drop')
    return this.sequelize.query(`DROP DATABASE IF EXISTS ${config.database}`)
  }
}

module.exports = new Database()
