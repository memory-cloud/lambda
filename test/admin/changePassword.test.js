process.env.DEBUG = 'test:login'

const debug = require('debug')('test:admin')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database')
const { mutationRegister, mutationChangePassword } = require('../graphql')

describe('A logged in admin', function () {
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
  })

  afterAll(async () => {
    await server.close()
    await database.dropDatabase()
    await database.close()
  })

  it('should change password', () => {
    mutationChangePassword.variables = {
      oldPassword: 'password',
      newPassword: 'newpassword'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationChangePassword)
      .expect(200)
      .expect(res => {
        debug(res.body)
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.changePassword).toBeDefined()
      })
  })

  it('should not change password with incorrect old password', () => {
    mutationChangePassword.variables = {
      oldPassword: 'wrongpassword',
      newPassword: 'newpassword'
    }
    return request(server)
      .post('/')
      .set('admin', token)
      .send(mutationChangePassword)
      .expect(200)
      .expect(res => {
        debug(res.body)
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.changePassword).toBeNull()
      })
  })
})
