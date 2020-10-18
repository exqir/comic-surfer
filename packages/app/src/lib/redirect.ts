export const redirectScript = `
  document.cookie && document.cookie.indexOf('authenticated') < 0 && location.replace('/login')
`.trim()

export const redirectKey = 'redirect'
