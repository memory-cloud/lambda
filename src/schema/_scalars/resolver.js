const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLPassword
} = require('graphql-custom-types')

const GraphQLJSON = require('graphql-type-json')

exports.resolver = {
  URL: GraphQLURL,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmail,
  Password: GraphQLPassword,
  JSON: GraphQLJSON
}
