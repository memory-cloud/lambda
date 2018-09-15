const app = require('./src/app')
const debug = require('debug')('server')

app.set('port', process.env.PORT || 1337)

module.exports = app.listen(app.get('port'), () => debug('running at http://127.0.0.1:' + app.get('port')))
