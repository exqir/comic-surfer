import { CreatorDbObject } from 'types/server-schema'
import { MongoDataSource } from './MongoDataSource'

export const creatorCollection = 'creator'
export class CreatorAPI extends MongoDataSource<CreatorDbObject> {
  public constructor() {
    super(creatorCollection)
  }
}
