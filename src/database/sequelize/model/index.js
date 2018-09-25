class Model {
  static get (model, db) {
    require('./' + model.toLowerCase())(db)
    return db.import(model, require('./' + model.toLowerCase()))
  }
}

module.exports = Model
