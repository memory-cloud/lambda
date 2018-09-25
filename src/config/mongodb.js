module.exports = {
  testing: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE
  },
  development: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE
  },
  production: {
    uri: process.env.MONGODB_URI,
    database: process.env.MONGODB_DATABASE
  },
  travis: {
    uri: 'mongodb://travis:test@127.0.0.1/',
    database: 'mydb_test'
  }
}
