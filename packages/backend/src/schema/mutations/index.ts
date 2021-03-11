import 'graphql-import-node'

import addNewReleases from './addNewReleases.graphql'
import addToPullList from './addToPullList.graphql'
import login from './login.graphql'
import logout from './logout.graphql'
import removeFromPullList from './removeFromPullList.graphql'
import updateComicBook from './updateComicBook.graphql'
import updateComicBookRelease from './updateComicBookRelease.graphql'
import updateComicSeriesBooks from './updateComicSeriesBooks.graphql'
import updateComicSeriesPublisher from './updateComicSeriesPublisher.graphql'
import verifyUpcomingReleases from './verifyUpcomingReleases.graphql'

export const mutations = [
  addNewReleases,
  addToPullList,
  login,
  logout,
  removeFromPullList,
  updateComicBook,
  updateComicBookRelease,
  updateComicSeriesBooks,
  updateComicSeriesPublisher,
  verifyUpcomingReleases,
]
