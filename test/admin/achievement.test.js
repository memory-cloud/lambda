const request = require('supertest')
const {
  mutationCreateAchievement,
  mutationUpdateAchievement,
  queryReadAchievement,
  mutationDeleteAchievement
} = require('../graphql')
const debug = require('debug')('test')
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
    await helper.CreateGame('GlobalIntLeaderboard Game', process.env.TEST_APPID, process.env.TEST_APPSECRET)
    return helper.CreateAchievement(1, 'title', 'description', 'https://www.example.com/img.png')
  })

  afterEach(async () => {
    return Setup.afterEach()
  })

  afterAll(async () => {
    return Setup.teardown(server)
  })

  it('should create a valid achievement', () => {
    mutationCreateAchievement.variables = {
      gameId: 1,
      title: 'title 2',
      description: 'description 2',
      image: 'https://www.example.com/img.png'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationCreateAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.createAchievement.id).toEqual(2)
        expect(res.body.data.createAchievement.title).toEqual(mutationCreateAchievement.variables.title)
        expect(res.body.data.createAchievement.description).toEqual(mutationCreateAchievement.variables.description)
        expect(res.body.data.createAchievement.image).toEqual(mutationCreateAchievement.variables.image)
      })
  })

  it('should read owns achievements', () => {
    queryReadAchievement.variables = {
      id: 1
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(queryReadAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.readAchievement.id).toEqual(1)
        expect(res.body.data.readAchievement.title).toEqual('title')
        expect(res.body.data.readAchievement.description).toEqual('description')
        expect(res.body.data.readAchievement.image).toEqual('https://www.example.com/img.png')
      })
  })

  it('should not create achievement in not own game', () => {
    mutationCreateAchievement.variables = {
      gameId: 5,
      title: 'title 2',
      description: 'description 2',
      image: 'https://www.example.com/img.png'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationCreateAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.createAchievement).toBeNull()
      })
  })

  it('should update a valid achievement', () => {
    mutationUpdateAchievement.variables = {
      id: 1,
      title: 'title updated',
      description: 'description updated',
      image: 'https://www.example.com/img-updated.png'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationUpdateAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.updateAchievement.id).toEqual(mutationUpdateAchievement.variables.id)
        expect(res.body.data.updateAchievement.title).toEqual(mutationUpdateAchievement.variables.title)
        expect(res.body.data.updateAchievement.description).toEqual(mutationUpdateAchievement.variables.description)
        expect(res.body.data.updateAchievement.image).toEqual(mutationUpdateAchievement.variables.image)
      })
  })

  it('should not update an invalid achievement', () => {
    mutationUpdateAchievement.variables = {
      id: 5,
      title: 'title updated',
      description: 'description updated',
      image: 'https://www.example.com/img-updated.png'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationUpdateAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.updateAchievement).toBeNull()
      })
  })

  it('should delete a valid achievement', () => {
    mutationDeleteAchievement.variables = {
      id: 1
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationDeleteAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.deleteAchievement).toBe(true)
      })
  })

  it('should not delete an invalid achievement', () => {
    mutationDeleteAchievement.variables = {
      id: 5
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationDeleteAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.deleteAchievement).toBeNull()
      })
  })
})
