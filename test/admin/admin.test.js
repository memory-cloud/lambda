const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const Helper = require('../helper')
const {
  queryMe,
  queryGames,
  queryGame
} = require('../graphql')

describe('An admin', () => {
  var server
  var helper
  beforeAll(async () => {
    server = await app.listen()
    helper = new Helper(server)
    return database.createDatabase()
  })

  beforeEach(async () => {
    await database.sync(true)
    await helper.Register('existent@user.com', 'password')
    return helper.CreateGame('Valid Game', 12345, 'valid-secret')
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    return database.close()
  })

  it('should get information', () => {
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(queryMe)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.me.email).toEqual('existent@user.com')
      })
  })

  it('should get error with invalid token', () => {
    return request(server)
      .post('/')
      .set('admin', helper.adminToken + 'asd')
      .send(queryMe)
      .expect(401)
  })

  it('should get all games information', () => {
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(queryGames)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.games).toHaveLength(1)
        expect(res.body.data.games[0].id).toEqual(1)
        expect(res.body.data.games[0].name).toEqual('Valid Game')
        expect(res.body.data.games[0].appid).toEqual(12345)
        expect(res.body.data.games[0].secret).toEqual('valid-secret')
        expect(res.body.data.games[0].players).toEqual(0)
      })
  })

  it('should get a game information', () => {
    queryGame.variables = {
      id: 1
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(queryGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.game.id).toEqual(1)
        expect(res.body.data.game.name).toEqual('Valid Game')
        expect(res.body.data.game.appid).toEqual(12345)
        expect(res.body.data.game.secret).toEqual('valid-secret')
        expect(res.body.data.game.players).toEqual(0)
      })
  })

  it('should get an error when not own game', () => {
    queryGame.variables = {
      id: 5
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(queryGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.errors[0].path).toBe('game')
        expect(res.body.errors[0].message).toBe('Game not found')
        expect(res.body.data.game).toBeNull()
      })
  })
})
