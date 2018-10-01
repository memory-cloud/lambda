module.exports = {
  testing: {
    url: process.env.REDIS_URL,
    db: 1
  },
  development: {
    url: process.env.REDIS_URL,
    db: 0
  },
  production: {
    url: process.env.REDIS_URL,
    db: 0
  },
  travis: {
    url: 'redis://localhost',
    db: 0
  }
}
