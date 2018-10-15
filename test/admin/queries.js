module.exports = {
  mutationChangePassword: {
    query: `mutation ($oldPassword: Password!, $newPassword: Password!) {
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
                players
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
                players
              }
            }`
  },
  mutationCreateAchievement: {
    query: `mutation ($title: String!, $description: String!, $GameId: Int!, $image: URL!) {
              createAchievement(achievement:{
                title: $title
                description: $description
                GameId: $GameId
                image: $image
              }){
                id
                title
                description
                image
              }
            }`
  },
  mutationUpdateAchievement: {
    query: `mutation ($id: Int!, $title: String!, $description: String!, $image: URL!) {
              updateAchievement(achievement: {
                id: $id
                title: $title
                description: $description
                image: $image
              }){
                id
                title
                description
                image
              }
            }`
  },
  queryReadAchievement: {
    query: `query ($id: Int!) {
              readAchievement(id: $id) {
                id
                title
                description
                image
              }    
            }`
  },
  mutationDeleteAchievement: {
    query: `mutation ($id: Int!) {
              deleteAchievement(id: $id)
            }`
  }
}
