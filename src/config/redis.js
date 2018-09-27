module.exports = {
  testing: {
    url: process.env.REDIS_URL
  },
  development: {
    url: process.env.REDIS_URL
  },
  production: {
    url: process.env.REDIS_URL
  },
  travis: {
    url: 'redis://localhost'
  }
}
