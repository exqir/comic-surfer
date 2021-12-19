import type * as O from 'fp-ts/lib/Option'

export interface IEnvironmentService {
  getMongoUrl: () => O.Option<string>
  getDbName: () => O.Option<string>
  getSourceOrigin: () => O.Option<string>
  getEncryptionToken: () => O.Option<string>
  getMagicApiKey: () => O.Option<string>
}
