import 'graphql-import-node'

import addNewReleases from './addNewReleases.graphql'
import addToPullList from './addToPullList.graphql'
import login from './login.graphql'
import logout from './logout.graphql'
import removeFromPullList from './removeFromPullList.graphql'
import setComicSeriesPublisher from './setComicSeriesPublisher.graphql'

export const mutations = [
  addNewReleases,
  addToPullList,
  login,
  logout,
  removeFromPullList,
  setComicSeriesPublisher,
]
