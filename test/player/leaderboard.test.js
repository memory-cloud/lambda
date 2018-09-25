const Facebook = require('../../src/service/facebook')
const debug = require('debug')('test')
const request = require('supertest')
const Helper = require('../helper')
const Setup = require('../setup')

const {
  mutationSaveState,
  queryGlobalIntLeaderboard,
  queryFriendsIntLeaderboard,
  queryGlobalFloatLeaderboard,
  queryFriendsFloatLeaderboard
} = require('../graphql')

describe('A player', () => {
  var server
  var helper
  var playersToken

  beforeAll(async () => {
    server = await Setup.setup()
    helper = new Helper(server)
    playersToken = await new Facebook(`${process.env.TEST_APPID}|${process.env.TEST_APPSECRET}`).getTestTokens()
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
    return Setup.teardown(server)
  })

  it('should get leaderboard', async () => {
    queryGlobalIntLeaderboard.variables = {
      key: 'asd'
    }
    return request(server)
      .post('/')
      .set('player', playersToken.player1)
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
      .set('player', playersToken.player1)
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
      .set('player', playersToken.player1)
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
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(queryFriendsFloatLeaderboard)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.FriendsFloatLeaderboard).toHaveLength(2)
      })
  })
})
