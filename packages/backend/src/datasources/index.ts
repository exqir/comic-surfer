import type { IDataSources, DataLayer } from 'types/app'
import type { ILogger } from 'services/LogService'

import { ComicBookRepository } from 'models/ComicBook/ComicBook.repository'
import { ComicSeriesRepository } from 'models/ComicSeries/ComicSeries.repository'
import { PublisherRepository } from 'models/Publisher/Publisher.repository'
import { PullListRepository } from 'models/PullList/PullList.repository'
import { QueueRepository } from 'models/Queue/Queue.repository'

interface IDataSourcesParameters {
  dataLayer: DataLayer
  logger: ILogger
}

export function dataSources({
  dataLayer,
  logger,
}: IDataSourcesParameters): () => IDataSources {
  return () => ({
    comicBook: new ComicBookRepository({ dataLayer, logger }),
    comicSeries: new ComicSeriesRepository({ dataLayer, logger }),
    publisher: new PublisherRepository({ dataLayer, logger }),
    pullList: new PullListRepository({ dataLayer, logger }),
    queue: new QueueRepository({ dataLayer, logger }),
  })
}
