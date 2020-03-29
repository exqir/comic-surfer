import { pipe } from 'fp-ts/lib/pipeable'
import { toNullable, fromNullable, chain, Option } from 'fp-ts/lib/Option'
import { identity, constNull } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'
import { Resolver } from 'types/app'
import {
  Maybe,
  QueryGetComicBookArgs,
  ComicBookDbObject,
  CreatorDbObject,
  PublisherDbObject,
  ComicSeriesDbObject,
} from 'types/server-schema'
import { mapPromise } from 'lib'
import { ObjectID } from 'mongodb'

interface ComicBookQuery {
  getComicBook: Resolver<ComicBookDbObject, QueryGetComicBookArgs>
}

interface ComicBookResolver {
  ComicBook: {
    creators: Resolver<CreatorDbObject[], {}, ComicBookDbObject>
    publisher: Resolver<PublisherDbObject, {}, ComicBookDbObject>
    series: Resolver<ComicSeriesDbObject, {}, ComicBookDbObject>
  }
}

export const ComicBookQuery: ComicBookQuery = {
  getComicBook: (_, { id }, { dataSources }) =>
    pipe(
      dataSources.comicBook.getById(id),
      mapPromise(fold(constNull, identity)),
      toNullable,
    ) as Promise<ComicBookDbObject | null> | null,
}

// TODO: Make Type Extraction more generic
// type ExtractMaybe<P> = P extends Maybe<infer T> ? T : never
// type A = ExtractMaybe<Maybe<ObjectID>>
// const maybeToOption = <T>(maybe: T) =>
//   fromNullable(maybe) as Option<ExtractMaybe<T>>

//   const foo: Maybe<ObjectID> = null
//   const str = maybeToOption(foo)

const maybeToOption1 = (maybe: Maybe<ObjectID>) => fromNullable(maybe)
const maybeToOption2 = (maybe: Maybe<ObjectID[]>) => fromNullable(maybe)

export const ComicBookResolver: ComicBookResolver = {
  ComicBook: {
    creators: ({ creators }, _, { dataSources }) =>
      pipe(
        creators,
        maybeToOption2,
        chain(o =>
          pipe(
            dataSources.creator.getByIds(o),
            mapPromise(fold(constNull, identity)),
          ),
        ),
        // TODO: check for falsy values of creators
        toNullable,
      ) as Promise<CreatorDbObject[] | null> | null,
    publisher: ({ publisher }, _, {}) => ({} as PublisherDbObject),
    series: ({ series }, _, { dataSources }) =>
      pipe(
        series,
        maybeToOption1,
        chain(o =>
          pipe(
            dataSources.comicSeries.getById(o),
            mapPromise(fold(constNull, identity)),
          ),
        ),
        toNullable,
        // TODO: Investigate where the types are lost resulting in unkown
        // a => a, // This a has the right type
      ) as Promise<ComicSeriesDbObject | null> | null,
  },
}
