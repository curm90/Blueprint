import { links } from '~/lib/constants'
import FooterNavLink from './FooterNavLink'

export default function FooterNav() {
  return (
    <nav className='flex justify-between p-4 border border-top fixed bottom-0 left-0 right-0 bg-background z-10 sm:hidden'>
      <ul className='flex justify-between items-center w-full'>
        {links.map((link) => (
          <FooterNavLink key={link.to} {...link} />
        ))}
      </ul>
    </nav>
  )
}
