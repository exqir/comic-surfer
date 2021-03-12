import * as IO from 'fp-ts/lib/IO'
import { flow } from 'fp-ts/lib/function'

export interface ILogger {
  log: (...args: any[]) => IO.IO<void>
  info: (...args: any[]) => IO.IO<void>
  error: (...args: any[]) => IO.IO<void>
  warn: (...args: any[]) => IO.IO<void>
}

export function createLogger(context: string, locale: string): ILogger {
  const addMeta = (...args: string[]) => () => {
    const date = new Date(Date.now())
    return [
      date.toLocaleDateString(locale),
      date.toLocaleTimeString(locale),
      context,
      ...args,
    ]
  }

  return {
    log: flow(
      addMeta,
      IO.map((a) => console.log(...a)),
    ),
    info: flow(
      addMeta,
      IO.map((a) => console.info(...a)),
    ),
    error: flow(
      addMeta,
      IO.map((a) => console.error(...a)),
    ),
    warn: flow(
      addMeta,
      IO.map((a) => console.warn(...a)),
    ),
  }
}
