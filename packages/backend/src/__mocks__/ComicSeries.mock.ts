import { ObjectID } from 'mongodb'

import { ComicSeriesDbObject } from 'types/server-schema'

export const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: [new ObjectID()],
  singleIssuesUrl: null,
  singleIssues: [new ObjectID()],
  publisher: new ObjectID(),
  lastModified: new Date(),
}
