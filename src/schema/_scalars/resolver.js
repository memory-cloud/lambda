const {
  GraphQLEmail,
  GraphQLURL,
  GraphQLDateTime,
  GraphQLPassword
} = require('graphql-custom-types')

exports.resolver = {
  URL: GraphQLURL,
  DateTime: GraphQLDateTime,
  Email: GraphQLEmail,
  Password: GraphQLPassword
}
