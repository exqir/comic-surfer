// TODO: add page to `from` query param to navigate back after login
export const redirectScript = `
  document.cookie && document.cookie.indexOf('authenticated') < 0 && location.replace('/login')
`.trim()

export const redirectKey = 'redirect'
