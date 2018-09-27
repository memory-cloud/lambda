class Collection {
  constructor (db, redis) {
    this.collection = db.collection(this.constructor.name)
    this.cache = redis
  }
}

module.exports = Collection
