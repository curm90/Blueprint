import { Link } from '@tanstack/react-router'
import ThemeToggle from '~/components/ThemeToggle'
import { Separator } from '~/components/ui/separator'
import { links } from '~/lib/constants'

export default function Header() {
  return (
    <header>
      <nav className='flex justify-between px-8 py-4 border border-bottom'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Blueprint</h1>
        </div>
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
