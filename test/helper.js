const request = require('supertest')

const {
  mutationRegister,
  mutationCreateGame,
  mutationCreateAchievement
} = require('./graphql')

class Helper {
  constructor (server) {
    this.server = server
    this.adminToken = ''
  }
  async Register (email, password) {
    mutationRegister.variables = {
      email: email,
      password: password
    }
    let res = await request(this.server)
      .post('/')
      .send(mutationRegister)
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
}

module.exports = Helper
