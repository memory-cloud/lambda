class TokenExpiredError extends require('./AppError') {
  constructor (message) {
    super(message || 'Token expired')
  }
}

module.exports = TokenExpiredError
