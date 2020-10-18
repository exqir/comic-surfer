export function useAuthentication() {
  if (typeof window === 'undefined') return false
  return document.cookie.indexOf('authenticated') > -1
}
