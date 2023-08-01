import * as React from 'react'
import GroceriesPage from '@/components/groceries.tsx'
import SignInPage from '@/components/sign-in.tsx'

export default function Home() {
  const [session, setSession] = React.useState<string | null>(null)

  const getSession = async () => {
    const token = localStorage.getItem('session')
    if (token) {
      setSession(token)
    }
  }

  React.useEffect(() => {
    getSession()
  }, [])

  React.useEffect(() => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    const token = params.get('token')
    if (token) {
      localStorage.setItem('session', token)
      window.location.replace(window.location.origin)
    }
  }, [])

  return session ? <GroceriesPage session={session} setSession={setSession} /> : <SignInPage />
}
