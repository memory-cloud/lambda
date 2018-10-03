const Facebook = require('../../src/service/player/facebookService')
const debug = require('debug')('test')
const request = require('supertest')
const Helper = require('../helper')
const Setup = require('../setup')

const {
  mutationSaveState,
  queryLoadState
} = require('./queries')

describe('A player', () => {
  var server
  var playersToken
  var helper
  beforeAll(async () => {
    server = await Setup.setup()
    playersToken = await new Facebook(null, `${process.env.TEST_APPID}|${process.env.TEST_APPSECRET}`).getTestTokens()
    helper = new Helper(server)
  })

  beforeEach(async () => {
    await Setup.beforeEach()
    await helper.Register('existent@user.com', 'password')
    return helper.CreateGame('GlobalIntLeaderboard Game', process.env.TEST_APPID, process.env.TEST_APPSECRET)
  })

  afterEach(async () => {
    return Setup.afterEach()
  })

  afterAll(async () => {
    return Setup.afterAll(server)
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
      ],
      objects: [
        {
          key: 'asd',
          value: {
            asd: 'asd'
          }
        }
      ]
    }

    await request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(mutationSaveState)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        debug(res.body)
        expect(res.body.data.Save).toBe(true)
      })

    return request(server)
      .post('/')
      .set('player', playersToken.player1)
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
        expect(res.body.data.Load.objects[0].key).toBe(mutationSaveState.variables.objects[0].key)
      })
  })

  it('should return error when no game is found', () => {
    return request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', 234234234234)
      .send(queryLoadState)
      .expect(401)
  })
})
