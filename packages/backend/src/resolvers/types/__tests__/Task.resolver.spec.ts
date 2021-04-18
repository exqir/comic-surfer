import type { GraphQLResolveInfo } from 'graphql'

import type { GraphQLContext } from 'types/app'
import {
  defaultAddComicBookTask,
  defaultUpdateComicBookTask,
  defaultScrapSingleIssuesTask,
  defaultUpdateComicBookReleaseTask,
  defaultUpdatePublisherTask,
} from '__mocks__/Queue.mock'

import { Task } from '../Task.resolver'

describe('[Task.__resolveType]', () => {
  it.each([
    ['AddComicBookTask', defaultAddComicBookTask],
    // TODO: Is this still needed as Task? Or is this only done directly
    // in the mutation now that list tasks enqueue the AddComicBookTask
    ['UpdateComicBookTask', defaultUpdateComicBookTask],
    ['UpdateComicSeriesPublisherTask', defaultUpdatePublisherTask],
    ['UpdateComicBookReleaseTask', defaultUpdateComicBookReleaseTask],
    ['ScrapComicBookListTask', defaultScrapSingleIssuesTask],
  ] as const)('should return type %s', async (typeName, task) => {
    const res = await Task.__resolveType(task, args, context, info)

    expect(res).toBe(typeName)
  })
})

const context = {} as GraphQLContext
const info = {} as GraphQLResolveInfo
const args = {}
