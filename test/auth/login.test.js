const request = require('supertest')
const { queryLogin } = require('../graphql')
const Helper = require('../helper')
const Setup = require('../setup')

describe('An user', () => {
  var server
  var helper

  beforeAll(async () => {
    server = await Setup.setup()
    helper = new Helper(server)
  })

  beforeEach(async () => {
    await Setup.beforeEach()
    return helper.Register('existent@user.com', 'password')
  })

  afterEach(async () => {
    return Setup.afterEach()
  })

  afterAll(async () => {
    return Setup.afterAll(server)
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
