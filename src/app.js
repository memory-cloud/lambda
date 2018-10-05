const express = require('express')
const expressGraphQL = require('express-graphql')
const GraphQLSchema = require('./schema')
const cors = require('cors')
const app = express()

app.use(require('./middleware/context'))
app.use(require('./middleware/player'))
app.use(require('./middleware/admin'))

app.use(
  '/', cors(),
  expressGraphQL((req) => {
    return {
      graphiql: process.env.NODE_ENV === 'development',
      context: req.context,
      schema: GraphQLSchema,
      formatError (err) {
        return {
          path: err.path ? err.path[0] : undefined,
          message: err.message
        }
      }
    }
  })
)

module.exports = app
