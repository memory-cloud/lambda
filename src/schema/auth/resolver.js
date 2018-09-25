const AuthRepository = require('../../database/sequelize/repository/authRepository')

exports.resolver = {
  Query: {
    login (_, { email, password }, context) {
      return new AuthRepository(context.db).login(email, password)
    }// ,
    // confirm (_, { email, confirmation }, context) {
    //   return new AuthRepository(context.db).confirm(email, confirmation)
    // }
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
