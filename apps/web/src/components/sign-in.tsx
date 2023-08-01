import * as React from 'react'
import { Link } from 'react-router-dom'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export default function SignInPage() {
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false)

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Icons.logo className="mx-auto h-6 w-6" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with GitHub to access your grocery list
          </p>
        </div>
        <Link
          to={`${
            import.meta.env.VITE_APP_API_URL ??
            'https://66kbun3t5h.execute-api.us-west-2.amazonaws.com'
          }/auth/github/authorize`}
          className={cn(buttonVariants({ variant: 'outline' }))}
          onClick={() => setIsGitHubLoading(true)}
        >
          {isGitHubLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{' '}
          Github
        </Link>
      </div>
    </div>
  )
}
