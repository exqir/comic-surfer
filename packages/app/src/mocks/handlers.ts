import { graphql, context } from 'msw'
import {
  GetCurrentComicBookReleasesQuery,
  GetComicBookQuery,
} from 'types/graphql-client-schema'

export const handlers = [
  graphql.mutation('loginStatus', (req, res, ctx) => {
    return res(
      context.cookie('auth', '123'),
      ctx.data({
        login: {
          _id: '1',
          owner: '1',
        },
      }),
    )
  }),
  graphql.query('getComicBook', (req, res, ctx) => {
    const id = req.variables.comicBookId

    let data: GetComicBookQuery = { comicBook: null }

    if (id === '1') {
      data.comicBook = {
        _id: '1',
        title: 'Descender',
        issueNo: '11',
        coverImgUrl:
          'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/343285/343285._SX1280_QL80_TTD_.jpg',
        releaseDate: new Date(2019, 10, 1),
        url: '/descender',
      }
    }
    if (id === '2') {
      data.comicBook = {
        _id: '2',
        title: 'Descender',
        issueNo: '12',
        coverImgUrl:
          'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/365617/365617._SX360_QL80_TTD_.jpg',
        releaseDate: new Date(2019, 11, 1),
        url: '/descender',
      }
    }

    return res(ctx.data(data))
  }),
  graphql.query('getCurrentComicBookReleases', (req, res, ctx) => {
    const { auth } = req.cookies
    if (auth) {
      const data: GetCurrentComicBookReleasesQuery = {
        releases: [
          {
            _id: '1',
            title: 'Descender',
            issueNo: '11',
            coverImgUrl:
              'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/343285/343285._SX1280_QL80_TTD_.jpg',
            url: '/descender',
          },
          {
            _id: '2',
            title: 'Descender',
            issueNo: '12',
            coverImgUrl:
              'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/365617/365617._SX360_QL80_TTD_.jpg',
            url: '/descender',
          },
        ],
      }

      return res(ctx.data(data))
    }

    return res(
      ctx.errors([
        {
          message: 'Failed to log in: username or password are invalid',
          locations: [
            {
              line: 8,
              column: 12,
            },
          ],
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        },
      ]),
    )
  }),
]
