const debug = require('debug')('middleware:player')
const GameRepository = require('../database/sequelize/repository/gameRepository')
const PlayerRepository = require('../database/sequelize/repository/playerRepository')

module.exports = async (req, res, next) => {
  if (!req.headers.player) return next()
  if (!req.headers.appid) return res.status(401).send('appid needed')

  const appid = req.headers.appid
  const token = req.headers.player
  try {
    const game = await new GameRepository(req.context.db).findByAppId(appid)
    req.context.player = await new PlayerRepository(req.context.db, req.context.redis).findByGameAndToken(game, token)
    if (req.context.player) return next()
    return res.status(401)
  } catch (err) {
    debug(err)
    return res.status(401).send(err)
  }
}
