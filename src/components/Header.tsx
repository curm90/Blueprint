import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { LogOut } from 'lucide-react'
import { authClient } from '~/lib/auth-client'
import ThemeToggle from '~/components/ThemeToggle'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { links } from '~/lib/constants'

export default function Header() {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          location.reload()
        },
      },
    })
  }

  return (
    <header>
      <nav className='flex justify-between px-4 sm:px-8 py-4 border border-bottom'>
        <Link to='/' className='flex items-center gap-2'>
          <Image src='logo.png' width={32} height={32} className='dark:invert' />
          <h4 className='text-foreground'>Blueprint</h4>
        </Link>
        <div className='flex items-center gap-4'>
          <ThemeToggle />
          <Separator orientation='vertical' className='h-6 hidden sm:block sm:self-auto!' />
          <ul className='items-center gap-4 hidden sm:flex'>
            {links.map((link) => (
              <li key={link.to}>
                <Link to={link.to} activeProps={{ className: 'text-sidebar-primary' }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button variant='ghost' size='icon' onClick={handleSignOut} title='Sign out'>
            <LogOut className='size-4' />
          </Button>
        </div>
      </nav>
    </header>
  )
}
