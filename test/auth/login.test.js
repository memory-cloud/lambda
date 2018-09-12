process.env.DEBUG = 'test:login'

// const debug = require('debug')('test:login')
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
        email: 's@s.com',
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

  it('should login with right credentials', () => {
    let postData = {
      query: `query login($email: String!, $password: String!){
                login(email: $email password: $password)
            }`,
      variables: {
        email: 's@s.com',
        password: 'ssssss'
      }
    }
    return request(server)
      .post('/')
      .send(postData)
      .expect(200)
      .expect(res => {
        expect(res.body.errors).toBeUndefined()
        expect(res.body.data.login).toBeDefined()
      })
  })

  it('should not login with wrong credentials', () => {
    let postData = {
      query: `query login($email: String!, $password: String!){
                  login(email: $email password: $password)
              }`,
      variables: {
        email: 's@s.com',
        password: 'sssssa'
      }
    }
    return request(server)
      .post('/')
      .send(postData)
      .expect(200)
      .expect(res => {
        expect(res.body.data.login).toBeNull()
        expect(res.body.errors).toHaveLength(1)
      })
  })
})
