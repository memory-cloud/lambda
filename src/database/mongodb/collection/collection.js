class Collection {
  constructor (db, name) {
    this.collection = db.collection(name)
  }
}

module.exports = Collection
