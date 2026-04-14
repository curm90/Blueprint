import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'

type FooterNavLinkProps = {
  icon: LucideIcon
  label: Link['label']
  to: Link['to']
}

export default function FooterNavLink({ icon: Icon, label, to }: FooterNavLinkProps) {
  return (
    <Link
      to={to}
      activeProps={{ className: 'text-sidebar-primary' }}
      className='flex flex-col items-center gap-1 text-sm'
    >
      <Icon className='w-4 h-4' />
      <span>{label}</span>
    </Link>
  )
}
