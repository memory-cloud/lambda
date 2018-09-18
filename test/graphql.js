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
  queryLeaderboard: {
    query: `query ($key: String!){
              Leaderboard(key: $key){
                id
                score
              }
            }`
  },
  queryLeaderboardFriends: {
    query: `query ($key: String!){
              LeaderboardFriends(key: $key){
                id
                score
              }
            }`
  },
  queryLeaderboardFloat: {
    query: `query ($key: String!){
              LeaderboardFloat(key: $key){
                id
                score
              }
            }`
  },
  queryLeaderboardFloatFriends: {
    query: `query ($key: String!){
              LeaderboardFloatFriends(key: $key){
                id
                score
              }
            }`
  },
  mutationCompleteAchievement: {
    query: `mutation ($title: String!) {
              CompleteAchievement(title: $title)
            }
    `
  },
  queryAchievements: {
    query: `query {
              Achievements {
                title
                description
                completedAt
              }
            }`
  }
}
