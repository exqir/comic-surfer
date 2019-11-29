export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type ComicBook = {
   __typename?: 'ComicBook',
  _id: Scalars['ID'],
  title: Scalars['String'],
  issue?: Maybe<Scalars['String']>,
  releaseDate?: Maybe<Scalars['String']>,
  creators?: Maybe<Array<Maybe<Creator>>>,
  series?: Maybe<ComicSeries>,
  publisher?: Maybe<Publisher>,
  coverUrl?: Maybe<Scalars['String']>,
  url: Scalars['String'],
};

export type ComicSeries = {
   __typename?: 'ComicSeries',
  _id: Scalars['ID'],
  title: Scalars['String'],
  url: Scalars['String'],
  collectionsUrl?: Maybe<Scalars['String']>,
  issuesUrl?: Maybe<Scalars['String']>,
  publisher?: Maybe<Publisher>,
  collections?: Maybe<Array<Maybe<ComicBook>>>,
  issues?: Maybe<Array<Maybe<ComicBook>>>,
};

export type Creator = {
   __typename?: 'Creator',
  _id: Scalars['ID'],
  firstname?: Maybe<Scalars['String']>,
  lastname: Scalars['String'],
  series?: Maybe<Array<Maybe<ComicSeries>>>,
};

export type Mutation = {
   __typename?: 'Mutation',
  createPullList: PullList,
  pullSeries: PullList,
  removeSeries: PullList,
  _empty?: Maybe<Scalars['String']>,
};


export type MutationCreatePullListArgs = {
  owner: Scalars['String']
};


export type MutationPullSeriesArgs = {
  owner: Scalars['String'],
  publisher: Scalars['String'],
  seriesUrl: Scalars['String']
};


export type MutationRemoveSeriesArgs = {
  owner: Scalars['String'],
  series: Scalars['ID']
};

export type Publisher = {
   __typename?: 'Publisher',
  _id: Scalars['String'],
  name: Scalars['String'],
  iconUrl?: Maybe<Scalars['String']>,
  url?: Maybe<Scalars['String']>,
  basePath?: Maybe<Scalars['String']>,
  seriesPath?: Maybe<Scalars['String']>,
  searchPath?: Maybe<Scalars['String']>,
  searchPathSeries?: Maybe<Scalars['String']>,
  series?: Maybe<Array<Maybe<ComicSeries>>>,
};

export type PullList = {
   __typename?: 'PullList',
  _id: Scalars['ID'],
  owner: Scalars['String'],
  list?: Maybe<Array<Maybe<ComicSeries>>>,
};

export type Query = {
   __typename?: 'Query',
  getComicBook?: Maybe<ComicBook>,
  getComicSeries?: Maybe<ComicSeries>,
  getPublishers?: Maybe<Array<Publisher>>,
  getPublisher?: Maybe<Publisher>,
  getPullList?: Maybe<PullList>,
  _empty?: Maybe<Scalars['String']>,
  getSearch?: Maybe<Array<Maybe<Search>>>,
  getSearchByPublishers?: Maybe<Array<Maybe<Search>>>,
};


export type QueryGetComicBookArgs = {
  id: Scalars['ID']
};


export type QueryGetComicSeriesArgs = {
  id: Scalars['ID']
};


export type QueryGetPublishersArgs = {
  names: Array<Scalars['String']>
};


export type QueryGetPublisherArgs = {
  name: Scalars['String']
};


export type QueryGetPullListArgs = {
  owner: Scalars['String']
};


export type QueryGetSearchArgs = {
  q: Scalars['String']
};


export type QueryGetSearchByPublishersArgs = {
  q: Scalars['String'],
  publishers: Array<Scalars['String']>
};

export type Search = {
   __typename?: 'Search',
  title: Scalars['String'],
  url: Scalars['String'],
  publisher: Publisher,
};

