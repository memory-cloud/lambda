class Collection {
  constructor (db, redis) {
    this.collection = db.collection(this.constructor.name)
    this.redis = redis
  }
}

module.exports = Collection
