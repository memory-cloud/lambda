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
  },
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
    query: `mutation ($title: String!, $description: String!, $gameId: Int!, $image: URL!) {
              createAchievement(achievement:{
                title: $title
                description: $description
                gameId: $gameId
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
  },
  mutationSaveState: {
    query: `mutation ($integers: [IntegerDictInput], $floats: [FloatDictInput], $booleans: [BooleanDictInput], $strings: [StringDictInput]) {
              Save (
                integers: $integers
                floats: $floats
                booleans: $booleans
                strings: $strings
              )
            }
    `
  },
  queryLoadState: {
    query: `query {
              Load {
                integers {
                  key
                  value
                }
                floats {
                  key
                  value
                }
                booleans {
                  key
                  value
                }
                strings {
                  key
                  value
                }
              }   
            }`
  },
  queryGlobalIntLeaderboard: {
    query: `query ($key: String!){
              GlobalIntLeaderboard(key: $key){
                id
                score
              }
            }`
  },
  queryFriendsIntLeaderboard: {
    query: `query ($key: String!){
              FriendsIntLeaderboard(key: $key){
                id
                score
              }
            }`
  },
  queryGlobalFloatLeaderboard: {
    query: `query ($key: String!){
              GlobalFloatLeaderboard(key: $key){
                id
                score
              }
            }`
  },
  queryFriendsFloatLeaderboard: {
    query: `query ($key: String!){
              FriendsFloatLeaderboard(key: $key){
                id
                score
              }
            }`
  },
  mutationCompleteAchievement: {
    query: `mutation ($title: String!) {
              CompleteAchievement(title: $title){
                title
                description
                image
              }
            }
    `
  },
  queryAchievements: {
    query: `query {
              Achievements {
                title
                description
                image
                completedAt
              }
            }`
  }
}
