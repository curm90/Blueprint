import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import ThemeToggle from '~/components/ThemeToggle'
import { Separator } from '~/components/ui/separator'
import { LINKS, DEFAULT_AVATAR } from '~/lib/constants'

export default function Header() {
  const { data: user } = useQuery(convexQuery(api.auth.getCurrentUser, {}))

  return (
    <header>
      <nav className='flex justify-between px-4 sm:px-8 py-4 border border-bottom'>
        <Link to='/' className='flex items-center gap-2'>
          <Image src='logo.png' width={32} height={32} className='dark:invert' />
          <h4 className='text-foreground'>Blueprint</h4>
        </Link>
        <div className='flex items-center gap-4'>
          <ul className='items-center gap-4 hidden sm:flex'>
            {LINKS.filter((link) => link.to !== '/profile').map((link) => (
              <li key={link.to}>
                <Link to={link.to} activeProps={{ className: 'text-sidebar-primary' }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Separator orientation='vertical' className='h-6 hidden sm:block sm:self-auto!' />
          <ThemeToggle />
          <Link
            to='/profile'
            title='Profile'
            className='block size-7 rounded-full overflow-hidden ring-1 ring-border hover:ring-2 hover:ring-primary transition-all'
          >
            <Image
              layout='fullWidth'
              src={user?.image || DEFAULT_AVATAR}
              alt='Profile'
              className='size-full object-cover'
            />
          </Link>
        </div>
      </nav>
    </header>
  )
}
