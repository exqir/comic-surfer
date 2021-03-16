import type { URL } from 'url'
import type * as O from 'fp-ts/lib/Option'

export interface IEnvironmentService {
  getMongoUrl: () => O.Option<string>
  getDbName: () => O.Option<string>
  getSourceBaseUrl: () => O.Option<URL>
  getEncryptionToken: () => O.Option<string>
  getMagicApiKey: () => O.Option<string>
}
