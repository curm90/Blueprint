import { render, screen, within } from '@testing-library/react'
import FooterNav from '~/components/FooterNav'

vi.mock('~/components/FooterNavLink', () => ({
  default: ({ label }: { label: string }) => <li>{label}</li>,
}))

describe('FooterNav', () => {
  it('should render the nav element', () => {
    render(<FooterNav />)
    screen.debug()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should render correct number of links', () => {
    render(<FooterNav />)

    const nav = screen.getByRole('navigation')
    const links = within(nav).getAllByRole('listitem')

    expect(links).toHaveLength(4)
  })

  it('should render the correct link labels', () => {
    render(<FooterNav />)

    const nav = screen.getByRole('navigation')
    const links = within(nav).getAllByRole('listitem')

    expect(links[0]).toHaveTextContent(/home/i)
    expect(links[1]).toHaveTextContent(/workouts/i)
    expect(links[2]).toHaveTextContent(/stats/i)
    expect(links[3]).toHaveTextContent(/settings/i)
  })
})
