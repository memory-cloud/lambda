module.exports = {
  queryLogin: {
    query: `query ($email: String!, $password: String!) {
              login(email: $email password: $password)
            }`
  },
  mutationRegister: {
    query: `mutation ($email: String!, $password: String!) {
              register(email: $email password: $password)
            }`
  },
  mutationChangePassword: {
    query: `mutation ($oldPassword: String!, $newPassword: String!) {
              changePassword(oldPassword: $oldPassword newPassword: $newPassword)
            }`
  },
  mutationCreateGame: {
    query: `mutation ($name: String!, $appid: BigInt!, $secret: String!) {
              createGame(game: {
                name: $name
                appid: $appid
                secret: $secret
              }) {
                id
              }
            }`
  }
}
