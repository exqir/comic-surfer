import * as IO from 'fp-ts/lib/IO'

import { DataLayer } from 'types/app'
import { ILogger } from 'services/LogService'

export const dataLayer = ({
  findOne: jest.fn(),
  findMany: jest.fn(),
  insertOne: jest.fn(),
  insertMany: jest.fn(),
  updateOne: jest.fn(),
  updateMany: jest.fn(),
  deleteOne: jest.fn(),
  deleteMany: jest.fn(),
} as unknown) as DataLayer

const io = IO.of(() => {})
export const logger = {
  log: jest.fn(io),
  error: jest.fn(io),
  warn: jest.fn(io),
  info: jest.fn(io),
} as ILogger
