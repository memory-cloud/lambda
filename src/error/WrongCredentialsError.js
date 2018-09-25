class WrongCredentialsError extends require('./AppError') {
  constructor (message) {
    super(message || 'Wrong credentials')
  }
}

module.exports = WrongCredentialsError
