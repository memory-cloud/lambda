const debug = require('debug')('test')
const request = require('supertest')
const Helper = require('../helper')
const Setup = require('../setup')

const {
  mutationSaveState,
  queryGlobalIntPosition,
  queryGlobalFloatPosition,
  queryFriendsIntPosition,
  queryFriendsFloatPosition
} = require('./queries')

describe('A player', () => {
  var server
  var helper
  var playersToken

  beforeAll(async () => {
    server = await Setup.setup()
    helper = new Helper(server)
    playersToken = await helper.GetTestTokens()
  })

  beforeEach(async () => {
    await Setup.beforeEach()
    await helper.Register('existent@user.com', 'password')
    await helper.CreateGame('GlobalIntLeaderboard Game', process.env.TEST_APPID, process.env.TEST_APPSECRET)

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
      ]
    }

    await request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(mutationSaveState)
      .expect(200)

    mutationSaveState.variables = {
      integers: [
        {
          key: 'asd',
          value: 550
        }
      ],
      floats: [
        {
          key: 'asd',
          value: 3.5
        }
      ]
    }

    return request(server)
      .post('/')
      .set('player', playersToken.player2)
      .set('appid', process.env.TEST_APPID)
      .send(mutationSaveState)
      .expect(200)
  })

  afterEach(async () => {
    return Setup.afterEach()
  })

  afterAll(async () => {
    return Setup.afterAll(server)
  })

  it('should get global int position', async () => {
    queryGlobalIntPosition.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(queryGlobalIntPosition)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.GlobalIntPosition.position).toBe(2)
      })
  })

  it('should get global float position', async () => {
    queryGlobalFloatPosition.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(queryGlobalFloatPosition)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.GlobalFloatPosition.position).toBe(1)
      })
  })

  it('should get friends int position', async () => {
    queryFriendsIntPosition.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(queryFriendsIntPosition)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.FriendsIntPosition.position).toBe(2)
      })
  })

  it('should get friends float position', async () => {
    queryFriendsFloatPosition.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(queryFriendsFloatPosition)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.FriendsFloatPosition.position).toBe(1)
      })
  })
})
