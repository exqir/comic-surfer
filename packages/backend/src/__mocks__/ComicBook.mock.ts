import { ObjectID } from 'mongodb'

import { ComicBookDbObject, ComicBookType } from 'types/graphql-schema'

export const defaultComicBook: ComicBookDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  issueNo: null,
  creators: [],
  coverImgUrl: '/cover.jpg',
  publisher: new ObjectID(),
  releaseDate: null,
  comicSeries: new ObjectID(),
  type: ComicBookType.SINGLEISSUE,
  description: null,
  lastModified: new Date(),
}
