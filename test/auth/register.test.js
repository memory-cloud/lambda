const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const { mutationRegister } = require('../graphql')
describe('A user', function () {
  var server

  beforeAll(async () => {
    server = await app.listen()
    return database.createDatabase()
  })

  beforeEach(async () => {
    await database.sync(true)

    mutationRegister.variables = {
      email: 'existent@user.com',
      password: 'ssssss'
    }

    return request(server)
      .post('/')
      .send(mutationRegister)
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
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
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
