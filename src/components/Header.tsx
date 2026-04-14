import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import ThemeToggle from '~/components/ThemeToggle'
import { Separator } from '~/components/ui/separator'
import { links } from '~/lib/constants'

export default function Header() {
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
        </div>
      </nav>
    </header>
  )
}
