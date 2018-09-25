class GameNotFoundError extends require('./AppError') {
  constructor (message) {
    super(message || 'Game not found')
  }
}

module.exports = GameNotFoundError
