import { createTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server'
import {
  constructTestServer,
  createMockReaderWithReturnValue,
} from 'tests/_utils'
import { ObjectID } from 'mongodb'
import { ComicBook } from 'types/server-schema'
// import comicBook from 'schema/comicBook';

const GET_COMICBOOK = gql`
  query comicBook($id: String!) {
    getComicBook(id: $id) {
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
    }
    const { server, comicBook } = constructTestServer()
    comicBook.getById = jest
      .fn()
      .mockReturnValueOnce(
        createMockReaderWithReturnValue<ComicBook>(mockComicBook),
      )

    const { query } = createTestClient(server)
    const res = await query({
      query: GET_COMICBOOK,
      variables: { id: mockComicBook._id },
    })

    expect(comicBook.getById).toHaveBeenCalledWith(mockComicBook._id)
    expect(res).toMatchObject({ data: { comicBook: mockComicBook } })
  })
})
