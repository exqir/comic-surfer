import { createTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server'
import { ObjectID } from 'mongodb'
import * as RTE from 'fp-ts/lib/ReaderTaskEither'

import { constructTestServer } from '__tests__/_utils'
import { ComicBook, ComicBookType } from 'types/graphql-schema'

const GET_COMICBOOK = gql`
  query comicBook($id: String!) {
    comicBook(id: $id) {
      _id
      title
      url
    }
  }
`

describe('Queries', () => {
  // TODO: integration tests are still failing.
  // Probably because the schema is not fully implemented.
  xit('fetches ComicBook', async () => {
    const mockComicBook: ComicBook = {
      _id: new ObjectID(),
      title: 'Comic',
      url: '/path',
      releaseDate: null,
      issueNo: '#12',
      coverImgUrl: '/',
      creators: [],
      comicSeries: null,
      publisher: null,
      type: ComicBookType.SINGLEISSUE,
      lastModified: new Date(),
      description: 'Description',
    }
    const { server, comicBook } = constructTestServer()
    comicBook.getById = jest.fn().mockReturnValueOnce(RTE.right(mockComicBook))

    // @ts-ignore
    const { query } = createTestClient(server)
    const res = await query({
      query: GET_COMICBOOK,
      variables: { id: mockComicBook._id },
    })

    expect(comicBook.getById).toHaveBeenCalledWith(mockComicBook._id)
    expect(res).toMatchObject({ data: { comicBook: mockComicBook } })
  })
})
