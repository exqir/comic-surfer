import * as Types from 'resolvers/types'
import * as Query from 'resolvers/queries'
import * as Mutation from 'resolvers/mutations'

export const resolvers = {
  Query,
  Mutation,
  ...Types,
}
