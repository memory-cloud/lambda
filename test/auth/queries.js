module.exports = {
  queryLogin: {
    query: `query ($email: Email!, $password: Password!) {
              login(email: $email password: $password)
            }`
  },
  mutationRegister: {
    query: `mutation ($email: Email!, $password: Password!) {
              register(email: $email password: $password)
            }`
  }
}
