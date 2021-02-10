import { ObjectID } from 'mongodb'

import { PublisherDbObject } from 'types/server-schema'

export const defaultPublisher: PublisherDbObject = {
  _id: new ObjectID(),
  name: 'Image',
  iconUrl: null,
  url: null,
  cxUrl: null,
  comicSeries: [],
}
