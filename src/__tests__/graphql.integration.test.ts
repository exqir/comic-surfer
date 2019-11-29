import { createTestClient } from 'apollo-server-testing'
import { gql } from 'apollo-server-micro'
import {
  constructTestServer,
  createMockOptionWithReturnValue,
} from 'tests/_utils'
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
    const mockComicBook = {
      _id: '1',
      title: 'Comic',
      url: '/path',
      releaseDate: '',
      issue: '#12',
      coverUrl: '/',
    }
    const { server, comicBookAPI } = constructTestServer()
    comicBookAPI.getById = jest
      .fn()
      .mockReturnValueOnce(createMockOptionWithReturnValue(mockComicBook))

    const { query } = createTestClient(server)
    const res = await query({ query: GET_COMICBOOK, variables: { id: '1' } })

    expect(comicBookAPI.getById).toHaveBeenCalledWith('1')
    expect(res).toMatchObject({ data: { comicBook: mockComicBook } })
  })
})
