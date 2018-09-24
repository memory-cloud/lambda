const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const { queryLogin } = require('../graphql')
const Helper = require('../helper')

describe('An user', () => {
  var server
  var helper

  beforeAll(async () => {
    server = await app.listen()
    helper = new Helper(server)
    return database.createDatabase()
  })

  beforeEach(async () => {
    await database.sync(true)
    return helper.Register('existent@user.com', 'password')
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    return database.close()
  })

  it('should login with right credentials', () => {
    queryLogin.variables = {
      email: 'existent@user.com',
      password: 'password'
    }
    return request(server)
      .post('/')
      .send(queryLogin)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.login).toBeDefined()
      })
  })

  it('should not login with wrong email', () => {
    queryLogin.variables = {
      email: 'wrong@user.com',
      password: 'wrongpassword'
    }
    return request(server)
      .post('/')
      .send(queryLogin)
      .expect(200)
      .expect(res => {
        expect(res.body.data.login).toBeNull()
        expect(res.body.errors).toHaveLength(1)
      })
  })

  it('should not login with wrong password', () => {
    queryLogin.variables = {
      email: 'existent@user.com',
      password: 'wrongpassword'
    }
    return request(server)
      .post('/')
      .send(queryLogin)
      .expect(200)
      .expect(res => {
        expect(res.body.data.login).toBeNull()
        expect(res.body.errors).toHaveLength(1)
      })
  })
})
