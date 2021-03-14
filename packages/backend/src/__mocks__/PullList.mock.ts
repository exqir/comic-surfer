import { ObjectID } from 'mongodb'

import { PullListDbObject } from 'types/graphql-schema'

export const defaultPullList: PullListDbObject = {
  _id: new ObjectID(),
  owner: 'user',
  list: [],
}
