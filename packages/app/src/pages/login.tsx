import React, { useState, FormEvent } from 'react'
import Router from 'next/router'
import { Magic } from 'magic-sdk'
import { mutate } from 'swr'

import { token } from 'lib/tokens'
import { query, fetcher } from 'data/loginUser'
import { Stack } from 'components/Stack'
import { Button } from 'components/Button'

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
      if (didToken) {
        await mutate(query, fetcher(didToken, query))
        // Set cookie with the same `Max-Age` as the session to check for
        // authentication status without having to use the API and redirect
        // earlier.
        // If the status in the cookie is not correct, an authentication error
        // by the API will still prevent data to be accessed when not loged in
        document.cookie = `authenticated=true;Max-Age=${60 * 60 * 8}`
        // Replace route with the page coming from or `/releases`
        // after successful login. Use replace instead of push here
        // so that the user will not go back to `/login` through browser back.
        const { from } = Router.query
        Router.replace(from && !Array.isArray(from) ? from : '/releases')
      } else {
        console.error('Missing login token')
        throw new Error('An unexpected error occurred.')
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error)
      setErrorMsg(error.message)
    }
  }

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <Stack space="large">
          <input
            className="input"
            name="email"
            type="email"
            placeholder="Email Adress"
          />
          <Button type="submit" isFullWidth>
            Login
          </Button>
        </Stack>
      </form>
      <style jsx>{`
        .login {
          max-width: 21rem;
          margin: 0 auto;
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .input {
          box-sizing: border-box;
          width: 100%;
          height: calc(2 * ${token('spaceXL')});
          border-width: 0;
          border-bottom: 1px solid #ccc;
          padding: 0 ${token('spaceM')};
        }
      `}</style>
    </div>
  )
}

export default Login
