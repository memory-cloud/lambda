class AchievementNotFound extends require('./AppError') {
  constructor (message) {
    super(message || 'Achievement not found')
  }
}

module.exports = AchievementNotFound
