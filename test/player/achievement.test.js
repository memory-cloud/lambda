const { FB } = require('fb')
const debug = require('debug')('test')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const Helper = require('../helper')
const {
  mutationCompleteAchievement,
  queryAchievements
} = require('../graphql')

describe('A player', () => {
  var server
  var player1Token
  var helper

  beforeAll(async () => {
    server = await app.listen()
    const playersToken = await getTestTokens()
    helper = new Helper(server)
    player1Token = playersToken.data[0].access_token
    return database.createDatabase()
  })

  beforeEach(async () => {
    await database.sync(true)
    await helper.Register('existent@user.com', 'password')
    await helper.CreateGame('Test Game', process.env.TEST_APPID, process.env.TEST_APPSECRET)
    await helper.CreateAchievement(1, 'title', 'description', 'https://www.example.com/img.png')
    return helper.CreateAchievement(1, 'title2', 'description2', 'https://www.example.com/img.png')
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    return database.close()
  })

  it('should complete achievement', async () => {
    mutationCompleteAchievement.variables = {
      title: 'title'
    }
    await request(server)
      .post('/')
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(mutationCompleteAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.CompleteAchievement.title).toBe('title')
      })

    return request(server)
      .post('/')
      .set('player', player1Token)
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
      .set('player', player1Token)
      .set('appid', process.env.TEST_APPID)
      .send(mutationCompleteAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.CompleteAchievement).toBeNull()
      })
  })
})

const getTestTokens = async () => {
  FB.setAccessToken(process.env.TEST_APPID + '|' + process.env.TEST_APPSECRET)
  return FB.api(process.env.TEST_APPID + '/accounts/test-users?fields=access_token')
}
