import { ComicBookDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'

export const collection = 'comicBook'
export class ComicBookAPI extends MongoDataSource<ComicBookDbObject> {
  public constructor() {
    super(collection)
  }
}
