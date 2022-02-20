import { cache } from 'swr'

import { query } from 'data/loginUser'

export function useAuthentication() {
  return !!cache.get(query)
}
