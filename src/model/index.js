class Model {
  static get (model, db) {
    return db.import(model, require('./' + model.toLowerCase()))
  }
}

module.exports = Model
