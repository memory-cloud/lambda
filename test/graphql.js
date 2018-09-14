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
                appid
                name
                secret
              }
            }`
  },
  queryMe: {
    query: `query {
              me {
                email
              }
            }`
  },
  queryGames: {
    query: `query {
              games {
                id
                name
                appid
                secret
                achievements {
                  id
                  title
                  description
                }
              }
            }`
  },
  queryGame: {
    query: `query ($id: Int!) {
              game (id: $id) {
                id
                name
                appid
                secret
                achievements {
                  id
                  title
                  description
                }
              }
            }`
  }
}
