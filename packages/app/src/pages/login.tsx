import { useState, FormEvent, Fragment } from 'react'
import Router from 'next/router'
import { Magic } from 'magic-sdk'

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')

    // @ts-ignore
    const email = e.currentTarget.email.value

    const body = JSON.stringify({
      operationName: 'login',
      query: `mutation login {
        login {
          _id
          owner
        }
      }
    `,
    })

    try {
      const magic = new Magic(
        process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY ?? '',
      )
      const didToken = await magic.auth.loginWithMagicLink({
        email,
      })
      const res = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + didToken,
        },
        body,
      })
      if (res.status === 200) {
        console.log((await res.json()).data.login.owner)
        // Router.push('/')
      } else {
        throw new Error(await res.text())
      }
    } catch (error) {
      console.error('An unexpected error happened occurred:', error)
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
