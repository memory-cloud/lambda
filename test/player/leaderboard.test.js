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
  queryLeaderboard,
  queryLeaderboardFriends,
  queryLeaderboardFloat,
  queryLeaderboardFloatFriends
} = require('../graphql')

describe('A player', () => {
  var server
  var adminToken
  var player1Token
  var player2Token

  beforeAll(async () => {
    server = await app.listen()
    const playersToken = await getTestTokens()
    player1Token = playersToken.data[0].access_token
    player2Token = playersToken.data[1].access_token
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

    await request(server)
      .post('/')
      .set('admin', adminToken)
      .send(mutationCreateGame)

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
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(mutationSaveState)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.Save).toBe(true)
      })

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

    await request(server)
      .post('/')
      .set('player', player2Token)
      .set('appid', process.env.TEST_APPID)
      .send(mutationSaveState)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.Save).toBe(true)
      })
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    await database.close()
  })

  it('should get leaderboard', async () => {
    queryLeaderboard.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryLeaderboard)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.Leaderboard).toHaveLength(2)
      })
  })

  it('should get leaderboard friends', async () => {
    queryLeaderboardFriends.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryLeaderboardFriends)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.LeaderboardFriends).toHaveLength(2)
      })
  })

  it('should get float leaderboard', async () => {
    queryLeaderboardFloat.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryLeaderboardFloat)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.LeaderboardFloat).toHaveLength(2)
      })
  })

  it('should get float leaderboard friends', async () => {
    queryLeaderboardFloatFriends.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryLeaderboardFloatFriends)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.LeaderboardFloatFriends).toHaveLength(2)
      })
  })
})

const getTestTokens = async () => {
  FB.setAccessToken(process.env.TEST_APPID + '|' + process.env.TEST_APPSECRET)
  return FB.api(process.env.TEST_APPID + '/accounts/test-users?fields=access_token')
}