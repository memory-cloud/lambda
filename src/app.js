const express = require('express')
const bodyparser = require('body-parser')
const expressGraphQL = require('express-graphql')
const GraphQLSchema = require('./schema')
const app = express()

app.use(bodyparser.json({ limit: '50mb' }))

app.use(require('./middlewares/context'))
app.use(require('./middlewares/player'))
app.use(require('./middlewares/admin'))

app.use(
  '/',
  expressGraphQL((req) => {
    return {
      graphiql: true,
      context: req.context,
      schema: GraphQLSchema
    }
  })
)

module.exports = app
