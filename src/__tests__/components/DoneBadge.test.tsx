import { render, screen } from '@testing-library/react'
import DoneBadge from '~/components/DoneBadge'

vi.mock('lucide-react', () => ({
  CheckCircle: () => (
    <svg data-testid='check-circle-icon' role='img' aria-label='Check Circle Icon' />
  ),
}))

describe('DoneBadge', () => {
  it('renders the text "Done"', () => {
    render(<DoneBadge />)
    const badgeElement = screen.getByText(/done/i)
    expect(badgeElement).toBeInTheDocument()
  })

  it('renders the CheckCircle icon', () => {
    render(<DoneBadge />)
    const iconElement = screen.getByTestId('check-circle-icon')
    expect(iconElement).toBeInTheDocument()
  })
})
