const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const {
  mutationRegister,
  mutationCreateGame,
  mutationCreateAchievement,
  mutationUpdateAchievement,
  queryReadAchievement,
  mutationDeleteAchievement
} = require('../graphql')

describe('A logged in admin', () => {
  var server
  var token

  beforeAll(async () => {
    server = await app.listen()
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
    token = res.body.data.register

    mutationCreateGame.variables = {
      name: 'Valid Game',
      appid: 12345,
      secret: 'valid-secret'
    }

    await request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateGame)

    mutationCreateAchievement.variables = {
      gameId: 1,
      title: 'title',
      description: 'description',
      image: 'https://www.example.com/img.png'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationCreateAchievement)
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    return database.close()
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
      .set('admin', token)
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
      .set('admin', token)
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
      .set('admin', token)
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
      .set('admin', token)
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
      .set('admin', token)
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
      .set('admin', token)
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
      .set('admin', token)
      .send(mutationDeleteAchievement)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.deleteAchievement).toBeNull()
      })
  })
})
