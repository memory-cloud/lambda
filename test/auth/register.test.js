process.env.DEBUG = 'test:register'

// const debug = require('debug')('test:register')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database')

describe('A user', function () {
  var server
  var registerMutation = {
    query: `mutation ($email: String!, $password: String!){
              register(email: $email password: $password)
            }`
  }

  beforeAll(async () => {
    server = await app.listen()
    return database.createDatabase()
  })

  beforeEach(async () => {
    await database.sync(true)

    registerMutation.variables = {
      email: 'existent@user.com',
      password: 'ssssss'
    }

    return request(server)
      .post('/')
      .send(registerMutation)
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    await database.close()
  })

  it('should register a new user', () => {
    registerMutation.variables = {
      email: 'new@user.com',
      password: 'validpassword'
    }
    return request(server)
      .post('/')
      .send(registerMutation)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.register).toBeDefined()
      })
  })

  it('should not register a existent user', () => {
    registerMutation.variables = {
      email: 'existent@user.com',
      password: 'asdasd'
    }
    return request(server)
      .post('/')
      .send(registerMutation)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })

  it('should not register a invalid email', () => {
    registerMutation.variables = {
      email: 'invalidemail.com',
      password: 'dddddd'
    }
    return request(server)
      .post('/')
      .send(registerMutation)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })

  it('should not register a invalid password', () => {
    registerMutation.variables = {
      email: 'valid@email.com',
      password: 'd'
    }
    return request(server)
      .post('/')
      .send(registerMutation)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })
})
