module.exports = class Repository {
  constructor (db, redis) {
    this.db = db
    this.redis = redis
  }
}
