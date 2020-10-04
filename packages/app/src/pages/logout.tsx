import { Fragment, useEffect } from 'react'
import Link from 'next/link'
import { mutate } from 'swr'

import { query, fetcher } from 'data/logoutUser'
import { query as loginQuery } from 'data/loginUser'

const logoutUser = async () => {
  await fetcher(query)
  await mutate(loginQuery, null, false)
}

const Logout = () => {
  // TODO: logout fetcher
  useEffect(() => {
    logoutUser()
  }, [])

  return (
    <Fragment>
      <div className="logout">
        Goodbye 👋
        <Link href="/login">
          <a>Login</a>
        </Link>
      </div>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
      `}</style>
    </Fragment>
  )
}

export default Logout
