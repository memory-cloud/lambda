process.env.DEBUG = 'test:register'

// const debug = require('debug')('test:register')
const request = require('supertest')
const app = require('../../src/app')
const database = require('../../src/database')

describe('A user', function () {
  var server

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
        password: 'ssssss'
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

  it('should register a new user', () => {
    let postData = {
      query: `mutation register($email: String!, $password: String!){
                  register(email: $email password: $password)
              }`,
      variables: {
        email: 'new@user.com',
        password: 'validpassword'
      }
    }
    return request(server)
      .post('/')
      .send(postData)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.register).toBeDefined()
      })
  })

  it('should not register a existent user', () => {
    let postData = {
      query: `mutation register($email: String!, $password: String!){
                  register(email: $email password: $password)
              }`,
      variables: {
        email: 'existent@user.com',
        password: 'asdasd'
      }
    }
    request(server)
      .post('/')
      .send(postData)
      .expect(200)
    return request(server)
      .post('/')
      .send(postData)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })

  it('should not register a invalid email', () => {
    let postData = {
      query: `mutation register($email: String!, $password: String!){
                  register(email: $email password: $password)
              }`,
      variables: {
        email: 'invalidemail.com',
        password: 'dddddd'
      }
    }
    return request(server)
      .post('/')
      .send(postData)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })

  it('should not register a invalid password', () => {
    let postData = {
      query: `mutation register($email: String!, $password: String!){
                  register(email: $email password: $password)
              }`,
      variables: {
        email: 'valid@email.com',
        password: 'd'
      }
    }
    return request(server)
      .post('/')
      .send(postData)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toHaveLength(1)
        expect(res.body.data.register).toBeNull()
      })
  })
})
