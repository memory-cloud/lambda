const { makeExecutableSchema } = require('graphql-tools')
const glue = require('schemaglue')
const debug = require('debug')('schema')
const { schema, resolver } = glue('src/schema', { ignore: '**.test.js, index.js' })

debug(schema)

debug(resolver)

const directiveResolvers = {
  isPlayer (next, src, args, context) {
    if (context.player) return next()
    throw new Error('Missing player')
  },
  isAdmin (next, src, args, context) {
    if (context.admin) return next()
    throw new Error('Missing admin')
  }
}

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
  directiveResolvers: directiveResolvers
})
