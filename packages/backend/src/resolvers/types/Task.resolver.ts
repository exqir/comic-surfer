import type { NonNullableResolver } from 'types/app'
import type { TaskDbInterface } from 'types/graphql-schema'
import {
  TaskType,
  AddComicBookTask,
  UpdateComicBookTask,
  UpdateComicSeriesPublisherTask,
  UpdateComicBookReleaseTask,
  ScrapComicBookListTask,
} from 'types/graphql-schema'

type TaskTypeName =
  | AddComicBookTask['__typename']
  | UpdateComicBookTask['__typename']
  | UpdateComicSeriesPublisherTask['__typename']
  | UpdateComicBookReleaseTask['__typename']
  | ScrapComicBookListTask['__typename']

interface TaskResolver {
  __resolveType: NonNullableResolver<TaskTypeName | null, {}, TaskDbInterface>
  [index: string]: any
}

export const Task: TaskResolver = {
  __resolveType: ({ type }) => {
    switch (type) {
      case TaskType.ADDCOMICBOOK:
        return 'AddComicBookTask'
      case TaskType.UPDATECOMICBOOK:
        return 'UpdateComicBookTask'
      case TaskType.UPDATECOMICSERIESPUBLISHER:
        return 'UpdateComicSeriesPublisherTask'
      case TaskType.UPDATECOMICBOOKRELEASE:
        return 'UpdateComicBookReleaseTask'
      case TaskType.SCRAPCOMICBOOKLIST:
        return 'ScrapComicBookListTask'
      default:
        return null
    }
  },
}
