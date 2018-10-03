module.exports = {
  mutationSaveState: {
    query: `mutation ($integers: [IntegerDictInput], $floats: [FloatDictInput], $booleans: [BooleanDictInput], $strings: [StringDictInput], $objects: [ObjectDictInput]) {
              Save (
                integers: $integers
                floats: $floats
                booleans: $booleans
                strings: $strings
                objects: $objects
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
                objects {
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
                position
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
  },
  queryGlobalIntPosition: {
    query: `query ($key: String!) {
              GlobalIntPosition(key: $key) {
                position
              }
            }`
  },
  queryGlobalFloatPosition: {
    query: `query ($key: String!) {
              GlobalFloatPosition(key: $key) {
                position
              }
            }`
  },
  queryFriendsIntPosition: {
    query: `query ($key: String!) {
              FriendsIntPosition(key: $key) {
                position
              }
            }`
  },
  queryFriendsFloatPosition: {
    query: `query ($key: String!) {
              FriendsFloatPosition(key: $key) {
                position
              }
            }`
  }
}
