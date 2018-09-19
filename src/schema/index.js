const { makeExecutableSchema } = require('graphql-tools')
const glue = require('schemaglue')
// const debug = require('debug')('schema')
const { schema, resolver } = glue('src/schema', { ignore: '**.test.js, index.js, directives.js' })
const directiveResolvers = require('./directives')

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver,
  directiveResolvers: directiveResolvers
})
