module.exports = {
  queryLogin: {
    query: `query ($email: String!, $password: String!){
              login(email: $email password: $password)
            }`
  },
  mutationRegister: {
    query: `mutation ($email: String!, $password: String!){
              register(email: $email password: $password)
            }`
  }
}
