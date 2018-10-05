const request = require('supertest')
const Facebook = require('../src/service/player/facebookService')

const { mutationRegister } = require('./auth/queries')

const {
  mutationCreateGame,
  mutationCreateAchievement
} = require('./admin/queries')

class Helper {
  constructor (server) {
    this.server = server
  }
  async Register (email, password) {
    mutationRegister.variables = {
      email: email,
      password: password
    }
    let res = await request(this.server)
      .post('/')
      .send(mutationRegister)
      .expect(200)
    this.adminToken = res.body.data.register
  }
  async CreateGame (name, appid, secret) {
    mutationCreateGame.variables = {
      name: name,
      appid: appid,
      secret: secret
    }

    return request(this.server)
      .post('/')
      .set('admin', this.adminToken)
      .send(mutationCreateGame)
      .expect(200)
  }
  async CreateAchievement (gameId, title, description, image) {
    mutationCreateAchievement.variables = {
      gameId: gameId,
      title: title,
      description: description,
      image: image
    }
    return request(this.server)
      .post('/')
      .set('admin', this.adminToken)
      .send(mutationCreateAchievement)
      .expect(200)
  }
  async GetTestTokens () {
    return new Facebook(null, `${process.env.TEST_APPID}|${process.env.TEST_APPSECRET}`).getTestTokens()
  }
}

module.exports = Helper
