const request = require('supertest')
const { mutationRegister } = require('../graphql')
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
    return Setup.teardown(server)
  })

  it('should register a new user', () => {
    mutationRegister.variables = {
      email: 'new@user.com',
      password: 'validpassword'
    }
    return request(server)
      .post('/')
      .send(mutationRegister)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.register).toBeDefined()
      })
  })

  it('should not register a new user when registration is closed', () => {
    mutationRegister.variables = {
      email: 'new@user.com',
      password: 'validpassword'
    }
    process.env.OPEN = 'false'
    return request(server)
      .post('/')
      .send(mutationRegister)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeDefined()
        expect(res.body.data.register).toBeNull()
      })
  })

  it('should not register a existent user', () => {
    mutationRegister.variables = {
      email: 'existent@user.com',
      password: 'asdasd'
    }
    return request(server)
      .post('/')
      .send(mutationRegister)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })

  it('should not register a invalid email', () => {
    mutationRegister.variables = {
      email: 'invalidemail.com',
      password: 'dddddd'
    }
    return request(server)
      .post('/')
      .send(mutationRegister)
      .expect(500)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data).toBeUndefined()
      })
  })

  it('should not register a invalid password', () => {
    mutationRegister.variables = {
      email: 'valid@email.com',
      password: 'd'
    }
    return request(server)
      .post('/')
      .send(mutationRegister)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })
})
