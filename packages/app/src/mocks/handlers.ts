import { graphql, context } from 'msw'
import {
  GetCurrentComicBookReleasesQuery,
  GetComicBookQuery,
  GetSearchQuery,
  SubscribeToComicSeriesMutation,
  LoginUserMutation,
  LogoutUserMutation,
  GetPullListQuery,
  GetComicSeriesQuery,
} from 'types/graphql-client-schema'

export const handlers = [
  graphql.mutation('loginUser', (req, res, ctx) => {
    if (req.headers.has('Authorization')) {
      const data: LoginUserMutation = {
        login: {
          _id: '1',
          owner: '1',
          list: [
            { _id: '1', url: '/descender' },
            { _id: '2', url: '/ascender' },
          ],
        },
      }
      return res(context.cookie('auth', '123'), ctx.data(data))
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
  graphql.mutation('logoutUser', (req, res, ctx) => {
    const data: LogoutUserMutation = {
      logout: true,
    }
    return res(context.cookie('auth', '', { maxAge: -1 }), ctx.data(data))
  }),
  graphql.mutation('subscribeToComicSeries', (req, res, ctx) => {
    const url = req.variables.comicSeriesUrl
    const data: SubscribeToComicSeriesMutation = {
      subscribeComicSeries: {
        _id: '1',
        owner: '1',
        list: [
          { _id: '1', url: '/descender' },
          { _id: '2', url: '/ascender' },
          { _id: '3', url },
        ],
      },
    }
    return res(ctx.data(data))
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
        title: 'Southern Bastards',
        issueNo: '20',
        coverImgUrl:
          'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/343285/343285._SX1280_QL80_TTD_.jpg',
        releaseDate: new Date(2019, 11, 1),
        url: '/southern-bastards',
      }
    }

    return res(ctx.data(data))
  }),
  graphql.query('getCurrentComicBookReleases', (req, res, ctx) => {
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
          title: 'Southern Bastards',
          issueNo: '20',
          coverImgUrl:
            'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/493985/493985._SX312_QL80_TTD_.jpg',
          url: '/southern-bastards',
        },
        {
          _id: '3',
          title: 'Low',
          issueNo: '24',
          coverImgUrl:
            'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/845911/845911._SX312_QL80_TTD_.jpg',
          url: '/low',
        },
        {
          _id: '4',
          title: 'Seven to Eternity',
          issueNo: '9',
          coverImgUrl:
            'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/528975/528975._SX312_QL80_TTD_.jpg',
          url: '/seven-to-eternity',
        },
      ],
    }

    return res(ctx.data(data))
  }),
  graphql.query('getSearch', (req, res, ctx) => {
    const id = req.variables.searchQuery

    let data: GetSearchQuery = {
      search: [
        { title: 'Descender', url: '/descender', inPullList: true },
        { title: 'Ascender', url: '/ascender', inPullList: true },
        { title: 'Low', url: '/low', inPullList: false },
        {
          title: 'Seven to Eternity',
          url: '/sevent-to-eternity',
          inPullList: false,
        },
      ],
    }

    return res(ctx.data(data))
  }),
  graphql.query('getPullList', (req, res, ctx) => {
    let data: GetPullListQuery = {
      pullList: {
        _id: '1',
        owner: '1',
        list: [
          { _id: '1', title: 'Descender' },
          { _id: '2', title: 'Ascender' },
        ],
      },
    }

    return res(ctx.data(data))
  }),
  graphql.query('getComicSeries', (req, res, ctx) => {
    const id = req.variables.comicSeriesId

    let data: GetComicSeriesQuery = { comicSeries: null }

    if (id === '1') {
      data = {
        comicSeries: {
          _id: '1',
          title: 'Descender',
          singleIssues: [
            {
              _id: '1',
              title: 'Descender',
              issueNo: '1',
              coverImgUrl:
                'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/343285/343285._SX1280_QL80_TTD_.jpg',
            },
            {
              _id: '2',
              title: 'Descender',
              issueNo: '2',
              coverImgUrl:
                'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/343285/343285._SX1280_QL80_TTD_.jpg',
            },
          ],
          collections: [],
          publisher: {
            _id: '1',
            name: 'Image',
          },
        },
      }
    }
    if (id === '2') {
      data = {
        comicSeries: {
          _id: '2',
          title: 'Ascender',
          singleIssues: [
            {
              _id: '1',
              title: 'Ascender',
              issueNo: '11',
              coverImgUrl:
                'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/343285/343285._SX1280_QL80_TTD_.jpg',
            },
            {
              _id: '2',
              title: 'Ascender',
              issueNo: '12',
              coverImgUrl:
                'https://images-na.ssl-images-amazon.com/images/S/cmx-images-prod/Item/343285/343285._SX1280_QL80_TTD_.jpg',
            },
          ],
          collections: [],
          publisher: {
            _id: '1',
            name: 'Image',
          },
        },
      }
    }

    return res(ctx.data(data))
  }),
]
