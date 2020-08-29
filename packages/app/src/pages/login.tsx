import { useState, FormEvent, Fragment } from 'react'
import Router from 'next/router'
import { Magic } from 'magic-sdk'
import { mutate } from 'swr'

import { query, fetcher } from '../data/loginUser'

const getToken = (email: string) => {
  if (process.env.NODE_ENV !== 'production') {
    return 'token'
  }
  const magic = new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? '')
  return magic.auth.loginWithMagicLink({
    email,
  })
}

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')

    // @ts-ignore
    const email = e.currentTarget.email.value

    try {
      const didToken = await getToken(email)
      const data = await fetcher(didToken!, query)
      if (data) {
        mutate(query, data, false)
        Router.push('/')
      } else {
        console.error('Missing data but no error from GraphQL')
        throw new Error('An unexpected error occurred.')
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <Fragment>
      <div className="login">
        <form onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email Adress" />
          <button type="submit">Login</button>
        </form>
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

export default Login
