import { URL } from 'url'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

import { EnvironmentService } from '../Environment/Environment.service'

describe('[EnvironmentService.getMongoUrl]', () => {
  beforeEach(() => {
    process.env = { MONGO_URL: undefined }
  })

  it('should return none when Mongo Url is not defined', () => {
    expect(pipe(EnvironmentService.getMongoUrl(), O.isNone)).toBe(true)
  })

  it('should return some with Mongo Url when defined', () => {
    const monogUrl = 'mongodb://mongo:27017'

    process.env.MONGO_URL = monogUrl

    expect.assertions(1)
    pipe(
      EnvironmentService.getMongoUrl(),
      O.map((url) => expect(url).toBe(monogUrl)),
    )
  })
})

describe('[EnvironmentService.getDbName]', () => {
  beforeEach(() => {
    process.env = { DB_NAME: undefined }
  })

  it('should return none when Db Name is not defined', () => {
    expect(pipe(EnvironmentService.getDbName(), O.isNone)).toBe(true)
  })

  it('should return some with Db Name when defined', () => {
    const dbName = 'dbname'

    process.env.DB_NAME = dbName

    expect.assertions(1)
    pipe(
      EnvironmentService.getDbName(),
      O.map((url) => expect(url).toBe(dbName)),
    )
  })
})

describe('[EnvironmentService.getSourceOrigin]', () => {
  beforeEach(() => {
    process.env = { COMIXOLOGY_BASE_URL: undefined }
  })

  it('should return none when Source Origin is not defined', () => {
    expect(pipe(EnvironmentService.getSourceOrigin(), O.isNone)).toBe(true)
  })

  it('should return none when Source Origin is not a valid URL', () => {
    process.env.COMIXOLOGY_BASE_URL = 'url'

    expect(pipe(EnvironmentService.getSourceOrigin(), O.isNone)).toBe(true)
  })

  it('should return some with Source Origin when defined', () => {
    const url = 'http://www.host.com'

    process.env.COMIXOLOGY_BASE_URL = url

    expect.assertions(1)
    pipe(
      EnvironmentService.getSourceOrigin(),
      O.map((o) => expect(o).toEqual(url)),
    )
  })
})

describe('[EnvironmentService.getEncryptionToken]', () => {
  beforeEach(() => {
    process.env = { TOKEN_SECRET: undefined }
  })

  it('should return none when Encryption Token is not defined', () => {
    expect(pipe(EnvironmentService.getEncryptionToken(), O.isNone)).toBe(true)
  })

  it('should return some with Encryption Token when defined', () => {
    const token = 'secret'

    process.env.TOKEN_SECRET = token

    expect.assertions(1)
    pipe(
      EnvironmentService.getEncryptionToken(),
      O.map((url) => expect(url).toBe(token)),
    )
  })
})

describe('[EnvironmentService.getMagicApiKey]', () => {
  beforeEach(() => {
    process.env = { MAGIC_APY_KEY: undefined }
  })

  it('should return none when Magic Api Key is not defined', () => {
    expect(pipe(EnvironmentService.getMagicApiKey(), O.isNone)).toBe(true)
  })

  it('should return some with Magic Api Key when defined', () => {
    const key = 'api-key'

    process.env.MAGIC_APY_KEY = key

    expect.assertions(1)
    pipe(
      EnvironmentService.getMagicApiKey(),
      O.map((url) => expect(url).toBe(key)),
    )
  })
})
