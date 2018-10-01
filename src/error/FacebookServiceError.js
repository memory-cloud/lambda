class FacebookServiceError extends require('./AppError') {
  constructor (message) {
    super(message || 'Facebook Service Error')
  }
}

module.exports = FacebookServiceError
