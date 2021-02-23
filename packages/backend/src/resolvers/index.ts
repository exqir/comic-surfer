import * as types from 'resolvers/types'
import * as Query from 'resolvers/queries'
import * as Mutation from 'resolvers/mutations'

export const resolvers = {
  Query,
  Mutation,
  ...types,
}
