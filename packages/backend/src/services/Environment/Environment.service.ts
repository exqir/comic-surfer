import { URL } from 'url'
import * as O from 'fp-ts/lib/Option'
import * as E from 'fp-ts/lib/Either'
import { pipe, constNull } from 'fp-ts/lib/function'

import type { IEnvironmentService } from './Environment.interface'

export const EnvironmentService: IEnvironmentService = {
  getMongoUrl,
  getDbName,
  getSourceBaseUrl,
  getEncryptionToken,
  getMagicApiKey,
}

function getMongoUrl(): O.Option<string> {
  return O.fromNullable(process.env.MONGO_URL)
}

function getDbName(): O.Option<string> {
  return O.fromNullable(process.env.DB_NAME)
}

function getSourceBaseUrl(): O.Option<URL> {
  return pipe(
    process.env.COMIXOLOGY_BASE_URL,
    O.fromNullable,
    O.chain((url) =>
      pipe(
        E.tryCatch(() => new URL(url), constNull),
        O.fromEither,
      ),
    ),
  )
}

function getEncryptionToken(): O.Option<string> {
  return O.fromNullable(process.env.TOKEN_SECRET)
}

function getMagicApiKey(): O.Option<string> {
  return O.fromNullable(process.env.MAGIC_APY_KEY)
}
