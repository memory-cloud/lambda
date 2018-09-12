process.env.DEBUG = 'test:login'

// const debug = require('debug')('test:login')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database')

describe('A user', function () {
  var server
  var loginQuery = {
    query: `query ($email: String!, $password: String!){
                login(email: $email password: $password)
            }`
  }

  beforeAll(async () => {
    server = await app.listen()
    return database.createDatabase()
  })

  beforeEach(async () => {
    await database.sync(true)

    let postData = {
      query: `mutation register($email: String!, $password: String!){
                  register(email: $email password: $password)
              }`,
      variables: {
        email: 'existent@user.com',
        password: 'password'
      }
    }
    return request(server)
      .post('/')
      .send(postData)
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    await database.close()
  })

  it('should login with right credentials', () => {
    loginQuery.variables = {
      email: 'existent@user.com',
      password: 'password'
    }
    return request(server)
      .post('/')
      .send(loginQuery)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.login).toBeDefined()
      })
  })

  it('should not login with wrong email', () => {
    loginQuery.variables = {
      email: 'wrong@user.com',
      password: 'wrongpassword'
    }
    return request(server)
      .post('/')
      .send(loginQuery)
      .expect(200)
      .expect(res => {
        expect(res.body.data.login).toBeNull()
        expect(res.body.errors).toHaveLength(1)
      })
  })

  it('should not login with wrong password', () => {
    loginQuery.variables = {
      email: 'existent@user.com',
      password: 'wrongpassword'
    }
    return request(server)
      .post('/')
      .send(loginQuery)
      .expect(200)
      .expect(res => {
        expect(res.body.data.login).toBeNull()
        expect(res.body.errors).toHaveLength(1)
      })
  })
})
