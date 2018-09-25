const request = require('supertest')
const { mutationChangePassword } = require('../graphql')
const Helper = require('../helper')
const Setup = require('../setup')

describe('An admin', () => {
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
