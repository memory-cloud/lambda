const { FB } = require('fb')
const debug = require('debug')('test')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const {
  mutationRegister,
  mutationCreateGame,
  mutationSaveState,
  queryGlobalIntLeaderboard,
  queryFriendsIntLeaderboard,
  queryGlobalFloatLeaderboard,
  queryFriendsFloatLeaderboard
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
      .expect(200)
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
      .expect(200)

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
      .set('player', player2Token)
      .set('appid', process.env.TEST_APPID)
      .send(mutationSaveState)
      .expect(200)
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    await database.close()
  })

  it('should get leaderboard', async () => {
    queryGlobalIntLeaderboard.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryGlobalIntLeaderboard)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.GlobalIntLeaderboard).toHaveLength(2)
      })
  })

  it('should get leaderboard friends', async () => {
    queryFriendsIntLeaderboard.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryFriendsIntLeaderboard)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.FriendsIntLeaderboard).toHaveLength(2)
      })
  })

  it('should get float leaderboard', async () => {
    queryGlobalFloatLeaderboard.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryGlobalFloatLeaderboard)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.GlobalFloatLeaderboard).toHaveLength(2)
      })
  })

  it('should get float leaderboard friends', async () => {
    queryFriendsFloatLeaderboard.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(queryFriendsFloatLeaderboard)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.FriendsFloatLeaderboard).toHaveLength(2)
      })
  })
})

const getTestTokens = async () => {
  FB.setAccessToken(process.env.TEST_APPID + '|' + process.env.TEST_APPSECRET)
  return FB.api(process.env.TEST_APPID + '/accounts/test-users?fields=access_token')
}
