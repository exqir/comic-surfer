export function createLogger(context: string, locale: string) {
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
    log: logging(console.log),
    info: logging(console.info),
    error: logging(console.error),
  }
}
