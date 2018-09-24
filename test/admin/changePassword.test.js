const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database/database')
const { mutationChangePassword } = require('../graphql')
const Helper = require('../helper')

describe('An admin', () => {
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

  it('should change password', () => {
    mutationChangePassword.variables = {
      oldPassword: 'password',
      newPassword: 'newpassword'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationChangePassword)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.changePassword).toBe(true)
      })
  })

  it('should not change password with incorrect old password', () => {
    mutationChangePassword.variables = {
      oldPassword: 'wrongpassword',
      newPassword: 'newpassword'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationChangePassword)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.changePassword).toBeNull()
      })
  })

  it('should not change password with invalid password', () => {
    mutationChangePassword.variables = {
      oldPassword: 'password',
      newPassword: 'ii'
    }
    return request(server)
      .post('/')
      .set('admin', helper.adminToken)
      .send(mutationChangePassword)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.changePassword).toBeNull()
      })
  })
})
