import { Logger } from 'types/app'
import { MongoError } from 'mongodb'

export const logError = (logger: Logger) => (err: MongoError) => {
  logger.error(err.message)
  return err
}