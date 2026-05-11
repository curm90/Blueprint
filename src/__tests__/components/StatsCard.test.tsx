import { render, screen } from '@testing-library/react'
import StatsCard from '~/components/StatsCard'

function makeProps() {
  return {
    label: 'Test Label',
    value: 42,
    suffix: 'Test Suffix',
    icon: <span>Test Icon</span>,
    color: 'text-red-500',
    bg: 'bg-red-100',
  }
}

describe('StatsCard', () => {
  it('renders the StatsCard component with correct props', () => {
    const props = makeProps()
    render(<StatsCard {...props} />)
    const labelElement = screen.getByText(/test label/i)
    const valueElement = screen.getByText(/42/i)
    const suffixElement = screen.getByText(/test suffix/i)
    const iconElement = screen.getByText(/test icon/i)

    expect(labelElement).toBeInTheDocument()
    expect(valueElement).toBeInTheDocument()
    expect(suffixElement).toBeInTheDocument()
    expect(iconElement).toBeInTheDocument()
  })
})
