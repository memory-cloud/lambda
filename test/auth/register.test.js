const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const { mutationRegister } = require('../graphql')
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
