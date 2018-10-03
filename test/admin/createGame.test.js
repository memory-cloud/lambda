const request = require('supertest')
const { mutationCreateGame } = require('./queries')
const Helper = require('../helper')
const Setup = require('../setup')

describe('An admin', () => {
  var server
  var helper

  beforeAll(async () => {
    server = await Setup.setup()
    helper = new Helper(server)
  })

  beforeEach(async () => {
    await Setup.beforeEach()
    await helper.Register('existent@user.com', 'password')
    return helper.CreateGame('Valid Game', 12345, 'valid-secret')
  })

  afterEach(async () => {
    return Setup.afterEach()
  })

  afterAll(async () => {
    return Setup.afterAll(server)
  })

  it('should create a valid game', () => {
    mutationCreateGame.variables = {
      name: 'test',
      appid: 1234234234,
      secret: 'asdasdasd'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.createGame.id).toEqual(2)
        expect(res.body.data.createGame.appid).toEqual(mutationCreateGame.variables.appid)
        expect(res.body.data.createGame.name).toEqual(mutationCreateGame.variables.name)
        expect(res.body.data.createGame.secret).toEqual(mutationCreateGame.variables.secret)
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
      .set('admin', helper.adminToken)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
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
      .set('admin', helper.adminToken)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
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
      .set('admin', helper.adminToken)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
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
      .set('admin', helper.adminToken)
      .send(mutationCreateGame)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.createGame).toBeNull()
      })
  })
})
