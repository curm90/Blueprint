import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  redirect,
  useRouteContext,
  useRouterState,
} from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import type { QueryClient } from '@tanstack/react-query'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react'
import type { ConvexQueryClient } from '@convex-dev/react-query'
import { Toaster } from 'sonner'
import appCss from '~/styles/app.css?url'
import Header from '~/components/Header'
import FooterNav from '~/components/FooterNav'
import { ThemeProvider } from '~/components/ThemeProvider'
import { authClient } from '~/lib/auth-client'
import { getToken } from '~/lib/auth-server'

const getAuth = createServerFn({ method: 'GET' }).handler(async () => {
  return await getToken()
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Blueprint',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  beforeLoad: async (ctx) => {
    const token = await getAuth()

    // all queries, mutations and actions through TanStack Query will be
    // authenticated during SSR if we have a valid token
    if (token) {
      // During SSR only (the only time serverHttpClient exists),
      // set the auth token to make HTTP queries with.
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token)
    }

    // Redirect unauthenticated users to login (except on the login page itself)
    if (!token && ctx.location.pathname !== '/login') {
      throw redirect({ to: '/login' })
    }

    return {
      isAuthenticated: !!token,
      token,
    }
  },
  notFoundComponent: () => <div>Route not found</div>,
  pendingComponent: () => (
    <div className='fixed top-0 left-0 right-0 z-50 h-0.5 bg-primary animate-pulse' />
  ),
  component: RootComponent,
})

// Helper to check if the current path is the login page
function isLoginPath(pathname: string) {
  return pathname === '/login'
}

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showChrome = !isLoginPath(pathname)

  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={authClient}
      initialToken={context.token}
    >
      <RootDocument showChrome={showChrome}>
        <Outlet />
      </RootDocument>
    </ConvexBetterAuthProvider>
  )
}

function RootDocument({
  children,
  showChrome,
}: {
  children: React.ReactNode
  showChrome: boolean
}) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          {showChrome && <Header />}
          <main className='p-4 sm:p-8 pb-24 sm:pb-8 flex flex-col gap-10 min-h-[calc(100vh-66px)] max-w-250 mx-auto'>
            {children}
          </main>
          <Toaster />
          {showChrome && <FooterNav />}
        </ThemeProvider>
        <Scripts />
        <TanStackRouterDevtools />
      </body>
    </html>
  )
}
