import { ObjectID } from 'mongodb'

import { ComicSeriesDbObject } from 'types/server-schema'

export const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: null,
  collections: [],
  singleIssuesUrl: null,
  singleIssues: [],
  publisher: null,
  lastModified: new Date(),
}
