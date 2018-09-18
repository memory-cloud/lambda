const AuthRepository = require('../../data/authRepository')

exports.resolver = {
  Query: {
    login (_, { email, password }, context) {
      return new AuthRepository(context.db).login(email, password)
    }
  },
  Mutation: {
    register (_, { email, password }, context) {
      return new AuthRepository(context.db).register(email, password)
    },
    changePassword (_, { oldPassword, newPassword }, context) {
      return new AuthRepository(context.db).changePassword(context.admin, oldPassword, newPassword)
    }
  }
}
