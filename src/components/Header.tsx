import { Link } from '@tanstack/react-router'

const links = [
  {
    label: 'Today',
    to: '/',
  },
  {
    label: 'Workouts',
    to: '/workouts',
  },
  {
    label: 'Progress',
    to: '/progress',
  },
]

export default function Header() {
  return (
    <header>
      <nav className='flex justify-between px-8 py-4 border border-bottom'>
        <div>
          <h1 className='text-2xl font-bold text-foreground'>Blueprint</h1>
        </div>
        <ul className='flex items-center gap-4'>
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
