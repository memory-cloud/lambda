const express = require('express')
const expressGraphQL = require('express-graphql')
const GraphQLSchema = require('./schema')
const app = express()

app.use(require('./middlewares/context'))
app.use(require('./middlewares/player'))
app.use(require('./middlewares/admin'))

app.use(
  '/',
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
