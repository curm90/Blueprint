import { render, screen } from '@testing-library/react'
import { Calendar } from 'lucide-react'
import FooterNavLink from '~/components/FooterNavLink'

let isActive = false

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, activeProps, className }: any) => (
    <a href={to} className={isActive ? `${className} ${activeProps.className}` : className}>
      {children}
    </a>
  ),
}))

const props = {
  icon: Calendar,
  label: 'Today',
  to: '/',
}

describe('FooterNavLink', () => {
  it('should render the link with the correct label and icon', () => {
    render(<FooterNavLink {...props} />)

    screen.debug()
    expect(screen.getByTestId('today-icon')).toBeInTheDocument()
    expect(screen.getByText(/today/i)).toBeInTheDocument()
  })

  it('should have the correct to/href property', () => {
    render(<FooterNavLink {...props} />)

    const linkElement = screen.getByRole('link', { name: /today/i })
    expect(linkElement).toHaveAttribute('href', props.to)
  })

  it('should apply active class when active', () => {
    isActive = true
    render(<FooterNavLink {...props} />)

    const linkElement = screen.getByRole('link', { name: /today/i })
    expect(linkElement).toHaveClass('text-sidebar-primary')
  })

  it('should not have active class when not active', () => {
    isActive = false
    render(<FooterNavLink {...props} />)

    const linkElement = screen.getByRole('link', { name: /today/i })
    expect(linkElement).not.toHaveClass('text-sidebar-primary')
  })
})
