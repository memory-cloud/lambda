process.env.DEBUG = 'test, resolver:admin,'
const debug = require('debug')('test')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const {
  mutationRegister,
  mutationCreateGame,
  queryMe,
  queryGames,
  queryGame
} = require('../graphql')

describe('A logged in admin', () => {
  var server
  var token

  beforeAll(async () => {
    server = await app.listen()
    return database.createDatabase()
  })

  beforeEach(async () => {
    await database.sync(true)

    mutationRegister.variables = {
      email: 'existent@user.com',
      password: 'password'
    }
    let res = await request(server)
      .post('/')
      .send(mutationRegister)
    token = res.body.data.register

    mutationCreateGame.variables = {
      name: 'Valid Game',
      appid: 12345,
      secret: 'valid-secret'
    }

    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateGame)
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    await database.close()
  })

  it('should get information', () => {
    return request(server)
      .post('/')
      .set('admin', token)
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
      .set('admin', token + 'asd')
      .send(queryMe)
      .expect(401)
  })

  it('should get all games information', () => {
    return request(server)
      .post('/')
      .set('admin', token)
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
      .set('admin', token)
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
      .set('admin', token)
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
