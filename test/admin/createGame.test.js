process.env.DEBUG = 'test:createGame'

const debug = require('debug')('test:createGame')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database')
const { mutationRegister, mutationCreateGame } = require('../graphql')

describe('A logged in admin', function () {
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

  it('should create a valid game', () => {
    mutationCreateGame.variables = {
      name: 'test',
      appid: 1234234234,
      secret: 'asdasdasd'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.createGame.id).toEqual(2)
      })
  })

  it('should not create a game with empty name', () => {
    mutationCreateGame.variables = {
      name: '',
      appid: 1234234234,
      secret: 'asdasdasd'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined()
        expect(res.body.data.createGame).toBeNull()
      })
  })

  it('should not create a game with invalid secret', () => {
    mutationCreateGame.variables = {
      name: 'Valid name',
      appid: 1234234234,
      secret: 'asdasdasd??-'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined()
        expect(res.body.data.createGame).toBeNull()
      })
  })

  it('should not create a game with invalid appid', () => {
    mutationCreateGame.variables = {
      name: 'Valid name',
      appid: 'asd',
      secret: 'asdasdasd'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined()
        expect(res.body.data.createGame).toBeNull()
      })
  })

  it('should not create a game with duplicated appid', () => {
    mutationCreateGame.variables = {
      name: 'Valid Game',
      appid: 12345,
      secret: 'valid-secret'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined()
        expect(res.body.data.createGame).toBeNull()
      })
  })
})