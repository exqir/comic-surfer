import 'graphql-import-node'

import addNewReleases from './addNewReleases.graphql'
import addToPullList from './addToPullList.graphql'
import login from './login.graphql'
import removeFromPullList from './removeFromPullList.graphql'

export const mutations = [
  addNewReleases,
  addToPullList,
  login,
  removeFromPullList,
]
