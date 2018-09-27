class Collection {
  constructor (db) {
    this.collection = db.collection(this.constructor.name)
  }
}

module.exports = Collection
