const debug = require('debug')('middleware:player')
const { FB } = require('fb')
const GameRepository = require('../data/gameRepository')
const PlayerRepository = require('../data/playerRepository')

module.exports = async (req, res, next) => {
  if (!req.headers.player) return next()

  if (!req.headers.appid) return res.status(401).send('appid needed')

  const appid = req.headers.appid

  const token = req.headers.player

  try {
    const game = await new GameRepository(req.context.db).findByAppId(appid)

    if (!game) throw new Error('Game not found')

    FB.setAccessToken(game.getToken())

    const response = await FB.api('/debug_token?input_token=' + token)

    if (response.data.error) return res.status(401).send(response.data.error.message)

    let player = await new PlayerRepository(req.context.db).findOrCreate(response.data.user_id, game)

    req.context.player = player[0]
    req.context.player.token = token

    next()
  } catch (err) {
    debug(err)
    res.status(401).send(err)
  }
}
