const Facebook = require('../../src/service/facebook')
const debug = require('debug')('test')
const request = require('supertest')
const Helper = require('../helper')
const Setup = require('../setup')
const {
  mutationCompleteAchievement,
  queryAchievements
} = require('../graphql')

describe('A player', () => {
  var server
  var playersToken
  var helper

  beforeAll(async () => {
    server = await Setup.setup()
    playersToken = await new Facebook(`${process.env.TEST_APPID}|${process.env.TEST_APPSECRET}`).getTestTokens()
    helper = new Helper(server)
  })

  beforeEach(async () => {
    await Setup.beforeEach()
    await helper.Register('existent@user.com', 'password')
    await helper.CreateGame('GlobalIntLeaderboard Game', process.env.TEST_APPID, process.env.TEST_APPSECRET)
    await helper.CreateAchievement(1, 'title', 'description', 'https://www.example.com/img.png')
    return helper.CreateAchievement(1, 'title2', 'description2', 'https://www.example.com/img.png')
  })

  afterEach(async () => {
    return Setup.afterEach()
  })

  afterAll(async () => {
    return Setup.afterAll(server)
  })

  it('should complete achievement', async () => {
    mutationCompleteAchievement.variables = {
      title: 'title'
    }
    await request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(mutationCompleteAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.CompleteAchievement.title).toBe('title')
      })

    return request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(queryAchievements)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.Achievements).toHaveLength(2)
        expect(res.body.data.Achievements[0].title).toBe('title')
        expect(res.body.data.Achievements[0].description).toBe('description')
        expect(res.body.data.Achievements[0].image).toBe('https://www.example.com/img.png')
        expect(res.body.data.Achievements[0].completedAt).toBeDefined()
        expect(res.body.data.Achievements[1].completedAt).toBeNull()
      })
  })

  it('should get error when achievement is not found', async () => {
    mutationCompleteAchievement.variables = {
      title: 'titlew adas d as'
    }
    return request(server)
      .post('/')
      .set('player', playersToken.player1)
      .set('appid', process.env.TEST_APPID)
      .send(mutationCompleteAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.CompleteAchievement).toBeNull()
      })
  })
})
