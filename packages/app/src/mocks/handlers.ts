import { graphql, context } from 'msw'
import { GetCurrentComicBookReleasesQuery } from 'types/graphql-client-schema'

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
  graphql.query('getCurrentComicBookReleases', (req, res, ctx) => {
    const { auth } = req.cookies
    if (auth) {
      const data: GetCurrentComicBookReleasesQuery = {
        releases: [
          {
            _id: '1',
            title: 'Descender',
            issueNo: '11',
            coverImgUrl: '/descender.jpg',
            url: '/descender',
          },
          {
            _id: '2',
            title: 'Descender',
            issueNo: '12',
            coverImgUrl: '/descender.jpg',
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
