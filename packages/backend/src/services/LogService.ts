import * as IO from 'fp-ts/lib/IO'

export interface ILogger {
  log: (...args: any[]) => IO.IO<void>
  info: (...args: any[]) => IO.IO<void>
  error: (...args: any[]) => IO.IO<void>
  warn: (...args: any[]) => IO.IO<void>
}

export function createLogger(context: string, locale: string): ILogger {
  const logging = (method: (...args: any[]) => void) => (...args: any[]) => {
    const date = new Date()
    method(
      date.toLocaleDateString(locale),
      date.toLocaleTimeString(locale),
      context,
      ...args,
    )
  }

  return {
    log: IO.of(logging(console.log)),
    info: IO.of(logging(console.info)),
    error: IO.of(logging(console.error)),
    warn: IO.of(logging(console.warn)),
  }
}
