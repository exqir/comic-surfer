import { ObjectID } from 'mongodb'

import { ComicSeriesDbObject } from 'types/graphql-schema'

export const defaultComicSeries: ComicSeriesDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  collectionsUrl: '/collections',
  collections: [new ObjectID()],
  singleIssuesUrl: '/single-issues',
  singleIssues: [new ObjectID()],
  publisher: new ObjectID(),
  lastModified: new Date(),
}
