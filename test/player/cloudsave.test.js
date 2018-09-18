process.env.DEBUG = 'test, middleware, database'

const { FB } = require('fb')
const debug = require('debug')('test')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const {
  mutationRegister,
  mutationCreateGame,
  mutationSaveState,
  queryLoadState
} = require('../graphql')

describe('A player', () => {
  var server
  var adminToken
  var playerToken

  beforeAll(async () => {
    server = await app.listen()
    const playersToken = await getTestTokens()
    playerToken = playersToken.data[0].access_token
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
    adminToken = res.body.data.register

    mutationCreateGame.variables = {
      name: 'Test Game',
      appid: process.env.TEST_APPID,
      secret: process.env.TEST_APPSECRET
    }

    return request(server)
      .post('/')
      .set('admin', adminToken)
      .send(mutationCreateGame)
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    await database.close()
  })

  it('should save and load state', async () => {
    mutationSaveState.variables = {
      integers: [
        {
          key: 'asd',
          value: 55
        }
      ],
      floats: [
        {
          key: 'asd',
          value: 32.5
        }
      ],
      strings: [
        {
          key: 'asd',
          value: 'string'
        }
      ],
      booleans: [
        {
          key: 'asd',
          value: false
        }
      ]
    }

    await request(server)
      .post('/')
      .set('player', playerToken)
      .set('appid', process.env.TEST_APPID)
      .send(mutationSaveState)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.Save).toBe(true)
      })

    return request(server)
      .post('/')
      .set('player', playerToken)
      .set('appid', process.env.TEST_APPID)
      .send(queryLoadState)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.Load.integers).toHaveLength(1)
        expect(res.body.data.Load.floats).toHaveLength(1)
        expect(res.body.data.Load.strings).toHaveLength(1)
        expect(res.body.data.Load.booleans).toHaveLength(1)
        expect(res.body.data.Load.integers[0].key).toBe(mutationSaveState.variables.integers[0].key)
        expect(res.body.data.Load.integers[0].value).toBe(mutationSaveState.variables.integers[0].value)
        expect(res.body.data.Load.floats[0].key).toBe(mutationSaveState.variables.floats[0].key)
        expect(res.body.data.Load.floats[0].value).toBe(mutationSaveState.variables.floats[0].value)
        expect(res.body.data.Load.strings[0].key).toBe(mutationSaveState.variables.strings[0].key)
        expect(res.body.data.Load.strings[0].value).toBe(mutationSaveState.variables.strings[0].value)
        expect(res.body.data.Load.booleans[0].key).toBe(mutationSaveState.variables.booleans[0].key)
        expect(res.body.data.Load.booleans[0].value).toBe(mutationSaveState.variables.booleans[0].value)
      })
  })

  it('should return error when no game is found', () => {
    return request(server)
      .post('/')
      .set('player', playerToken)
      .set('appid', 234234234234)
      .send(queryLoadState)
      .expect(401)
  })
})

const getTestTokens = async () => {
  FB.setAccessToken(process.env.TEST_APPID + '|' + process.env.TEST_APPSECRET)
  return FB.api(process.env.TEST_APPID + '/accounts/test-users?fields=access_token')
}
