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
  creators: Array<Creator>;
  comicSeries?: Maybe<ComicSeries>;
  publisher?: Maybe<Publisher>;
  coverImgUrl?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  type: ComicBookType;
  lastModified: Scalars['Date'];
};

export enum ComicBookType {
  Singleissue = 'SINGLEISSUE',
  Collection = 'COLLECTION'
}

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
  lastModified: Scalars['Date'];
};

export type Creator = {
   __typename?: 'Creator';
  name: Scalars['String'];
};


export type Mutation = {
   __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']>;
  login: PullList;
  logout: Scalars['Boolean'];
  scrapCollectionsList?: Maybe<Array<ComicBook>>;
  scrapComicBook?: Maybe<ComicBook>;
  scrapSingleIssuesList?: Maybe<Array<ComicBook>>;
  subscribeComicSeries: PullList;
  subscribeExistingComicSeries: PullList;
  unsubscribeComicSeries: PullList;
  updateComicBookRelease?: Maybe<ComicBook>;
  updateComicBooks?: Maybe<Array<ComicBook>>;
  updateComicSeries?: Maybe<Array<ComicSeries>>;
};


export type MutationScrapCollectionsListArgs = {
  comicSeriesId: Scalars['ID'];
  comicBookListUrl: Scalars['String'];
};


export type MutationScrapComicBookArgs = {
  comicBookUrl: Scalars['String'];
};


export type MutationScrapSingleIssuesListArgs = {
  comicSeriesId: Scalars['ID'];
  comicBookListUrl: Scalars['String'];
};


export type MutationSubscribeComicSeriesArgs = {
  comicSeriesUrl: Scalars['String'];
};


export type MutationSubscribeExistingComicSeriesArgs = {
  comicSeriesId: Scalars['ID'];
};


export type MutationUnsubscribeComicSeriesArgs = {
  comicSeriesId: Scalars['ID'];
};


export type MutationUpdateComicBookReleaseArgs = {
  comicBookId: Scalars['ID'];
};

export type Publisher = {
   __typename?: 'Publisher';
  _id: Scalars['String'];
  name: Scalars['String'];
  iconUrl?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  cxUrl?: Maybe<Scalars['String']>;
  comicSeries: Array<ComicSeries>;
};

export type PullList = {
   __typename?: 'PullList';
  _id: Scalars['ID'];
  owner: Scalars['String'];
  list: Array<ComicSeries>;
};

export type Query = {
   __typename?: 'Query';
  _empty?: Maybe<Scalars['String']>;
  comicBook?: Maybe<ComicBook>;
  comicSeries?: Maybe<ComicSeries>;
  publisher?: Maybe<Publisher>;
  publishers?: Maybe<Array<Publisher>>;
  pullList?: Maybe<PullList>;
  releases?: Maybe<Array<ComicBook>>;
  search?: Maybe<Array<Search>>;
};


export type QueryComicBookArgs = {
  id: Scalars['ID'];
};


export type QueryComicSeriesArgs = {
  id: Scalars['ID'];
};


export type QueryPublisherArgs = {
  name: Scalars['String'];
};


export type QueryPublishersArgs = {
  names?: Maybe<Array<Scalars['String']>>;
};


export type QueryReleasesArgs = {
  month?: Maybe<Scalars['Int']>;
  year?: Maybe<Scalars['Int']>;
  type?: Maybe<ComicBookType>;
};


export type QuerySearchArgs = {
  q: Scalars['String'];
};

export type Search = {
   __typename?: 'Search';
  title: Scalars['String'];
  url: Scalars['String'];
};

