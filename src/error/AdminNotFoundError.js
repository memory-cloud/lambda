class AdminNotFoundError extends require('./AppError') {
  constructor (message) {
    super(message || 'Admin not found')
  }
}

module.exports = AdminNotFoundError
