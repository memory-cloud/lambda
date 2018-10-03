const AuthRepository = require('../../service/auth/authRepository')

exports.resolver = {
  Query: {
    login (_, { email, password }, { db }) {
      return new AuthRepository(db).login(email, password)
    }// ,
    // confirm (_, { email, confirmation }, context) {
    //   return new AuthRepository(db).confirm(email, confirmation)
    // }
  },
  Mutation: {
    register (_, { email, password }, { db }) {
      return new AuthRepository(db).register(email, password)
    },
    changePassword (_, { oldPassword, newPassword }, { db, admin }) {
      return new AuthRepository(db).changePassword(admin, oldPassword, newPassword)
    }
  }
}
