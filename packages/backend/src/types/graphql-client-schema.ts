export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type ComicBook = {
   __typename?: 'ComicBook';
  _id: Scalars['ID'];
  title: Scalars['String'];
  issueNo?: Maybe<Scalars['String']>;
  releaseDate?: Maybe<Scalars['Date']>;
  creators: Array<Maybe<Creator>>;
  comicSeries?: Maybe<ComicSeries>;
  publisher?: Maybe<Publisher>;
  coverImgUrl?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

export type ComicSeries = {
   __typename?: 'ComicSeries';
  _id: Scalars['ID'];
  title: Scalars['String'];
  url: Scalars['String'];
  collectionsUrl?: Maybe<Scalars['String']>;
  singleIssuesUrl?: Maybe<Scalars['String']>;
  publisher?: Maybe<Publisher>;
  collections: Array<ComicBook>;
  singleIssues: Array<ComicBook>;
};

export type Creator = {
   __typename?: 'Creator';
  _id: Scalars['ID'];
  firstname?: Maybe<Scalars['String']>;
  lastname: Scalars['String'];
  series?: Maybe<Array<ComicSeries>>;
};


export type Mutation = {
   __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  createPullList: PullList;
  pullSeries: PullList;
  removeSeries: PullList;
};


export type MutationCreatePullListArgs = {
  owner: Scalars['String'];
};


export type MutationPullSeriesArgs = {
  owner: Scalars['String'];
  publisher: Scalars['String'];
  seriesUrl: Scalars['String'];
};


export type MutationRemoveSeriesArgs = {
  owner: Scalars['String'];
  series: Scalars['ID'];
};

export type Publisher = {
   __typename?: 'Publisher';
  _id: Scalars['String'];
  name: Scalars['String'];
  iconUrl?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  basePath?: Maybe<Scalars['String']>;
  seriesPath?: Maybe<Scalars['String']>;
  searchPath?: Maybe<Scalars['String']>;
  searchPathSeries?: Maybe<Scalars['String']>;
  series?: Maybe<Array<ComicSeries>>;
};

export type PullList = {
   __typename?: 'PullList';
  _id: Scalars['ID'];
  owner: Scalars['String'];
  list?: Maybe<Array<ComicSeries>>;
};

export type Query = {
   __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  comicBook?: Maybe<ComicBook>;
  comicSeries?: Maybe<ComicSeries>;
  getPublisher?: Maybe<Publisher>;
  getPublishers?: Maybe<Array<Publisher>>;
  getPullList?: Maybe<PullList>;
  getSearch?: Maybe<Array<Maybe<Search>>>;
};


export type QueryComicBookArgs = {
  id: Scalars['ID'];
};


export type QueryComicSeriesArgs = {
  id: Scalars['ID'];
};


export type QueryGetPublisherArgs = {
  name: Scalars['String'];
};


export type QueryGetPublishersArgs = {
  names: Array<Scalars['String']>;
};


export type QueryGetPullListArgs = {
  owner: Scalars['String'];
};


export type QueryGetSearchArgs = {
  q: Scalars['String'];
};

export type Search = {
   __typename?: 'Search';
  title: Scalars['String'];
  url: Scalars['String'];
};

