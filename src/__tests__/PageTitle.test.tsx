import { render, screen } from '@testing-library/react'
import PageTitle from '~/components/PageTitle'

describe('PageTitle', () => {
  it('renders the PageTitle component with correct content', () => {
    render(<PageTitle title='Test Title' />)

    expect(screen.getByRole('heading', { name: /test title/i })).toBeInTheDocument()
  })

  it('renders the subtitle when provided', () => {
    render(<PageTitle title='Test Title' subtitle='Test Subtitle' />)

    expect(screen.getByText(/test subtitle/i)).toBeInTheDocument()
  })

  it('does not render the subtitle when not provided', () => {
    render(<PageTitle title='Test Title' />)

    expect(screen.queryByText(/test subtitle/i)).not.toBeInTheDocument()
  })
})
