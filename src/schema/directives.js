module.exports = {
  hasRole (next, src, { requires }, context) {
    switch (requires) {
      case 'PLAYER':
        if (context.player) return next()
        break
      case 'FACEBOOK':
        if (context.player.token) return next()
        break
      case 'ADMIN':
        if (context.admin) return next()
        break
    }
    throw new Error('Not authorized')
  }
}
