import { ObjectID } from 'mongodb'

import { ComicBookDbObject, ComicBookType } from 'types/server-schema'

export const defaultComicBook: ComicBookDbObject = {
  _id: new ObjectID(),
  title: 'Comic',
  url: '/path',
  issueNo: null,
  creators: [],
  coverImgUrl: null,
  publisher: new ObjectID(),
  releaseDate: null,
  comicSeries: new ObjectID(),
  type: ComicBookType.SINGLEISSUE,
  description: null,
  lastModified: new Date(),
}
