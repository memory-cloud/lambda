module.exports = {
  testing: {
    username: 'root',
    password: 'root',
    database: 'testdb',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  development: {
    username: 'root',
    password: 'root',
    database: 'memorycloud',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST,
    dialect: 'mysql'
  },
  travis: {
    username: 'travis',
    password: null,
    database: 'travis',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
}
