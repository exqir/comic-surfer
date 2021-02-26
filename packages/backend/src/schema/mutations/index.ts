import 'graphql-import-node'

import addNewReleases from './addNewReleases.graphql'
import addToPullList from './addToPullList.graphql'
import removeFromPullList from './removeFromPullList.graphql'

export const mutations = [addNewReleases, addToPullList, removeFromPullList]
