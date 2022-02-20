import React, { useState, FormEvent, ReactElement } from 'react'
import Router from 'next/router'
import { Magic } from 'magic-sdk'
import { mutate } from 'swr'

import { styled } from 'stitches.config'
import { query, fetcher } from 'data/loginUser'
import { Head } from 'components/Head'
import { Heading, Button, Stack } from 'components'
import { AnonymousUserLayout } from 'layouts'

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
      if (error instanceof Error) {
        setErrorMsg(error.message)
      }
    }
  }

  return (
    <>
      <Head title="Login" />
      <Stack space="large">
        <Heading as="h1" variant="h1">
          Login
        </Heading>
        <Container>
          <form onSubmit={handleSubmit}>
            <Stack space="large">
              <EmailInput
                name="email"
                type="email"
                placeholder="Email Adress"
              />
              <Button type="submit" isFullWidth>
                Login
              </Button>
            </Stack>
          </form>
        </Container>
      </Stack>
    </>
  )
}

export default Login

Login.getLayout = (page: ReactElement) => {
  return <AnonymousUserLayout>{page}</AnonymousUserLayout>
}

const Container = styled('div', {
  maxWidth: '21rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
})

const EmailInput = styled('input', {
  boxSizing: 'border-box',
  width: '100%',
  height: 'calc(2 * $space$xl)',
  borderWidth: 0,
  borderBottom: '1px solid #ccc',
  padding: '0 $m',
  background: 'transparent',
})
