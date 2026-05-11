import { render, screen } from '@testing-library/react'
import { Smile } from 'lucide-react'
import TrackWorkoutOptionBtn from '~/components/TrackWorkoutOptionBtn'

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('lucide-react')>()
  return {
    ...actual,
    Check: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid='check-icon' {...props} />,
  }
})

function makeProps(overrides: Partial<TrackWorkoutOptionBtnProps> = {}) {
  return {
    id: 'just-right' as const,
    title: 'Just Right',
    description: 'Felt good',
    onSelect: vi.fn(),
    isSelected: false,
    icon: Smile,
    buttonClassName: 'border-green-500',
    iconColor: 'text-green-500',
    ...overrides,
  }
}

describe('TrackWorkoutOptionBtn', () => {
  it('should render the button', () => {
    render(<TrackWorkoutOptionBtn {...makeProps()} />)

    expect(screen.getByRole('button', { name: /just right/i })).toBeInTheDocument()
  })

  it('renders the title, description and icon', () => {
    render(<TrackWorkoutOptionBtn {...makeProps()} />)

    expect(screen.getByText(/just right/i)).toBeInTheDocument()
    expect(screen.getByText(/felt good/i)).toBeInTheDocument()
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('should show the check icon when selected', () => {
    render(<TrackWorkoutOptionBtn {...makeProps({ isSelected: true })} />)

    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
  })

  it('should set aria-pressed to true when selected', () => {
    render(<TrackWorkoutOptionBtn {...makeProps({ isSelected: true })} />)

    expect(screen.getByRole('button', { name: /just right/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  it('should not show the check icon when not selected', () => {
    render(<TrackWorkoutOptionBtn {...makeProps({ isSelected: false })} />)

    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument()
  })

  it('should set aria-pressed to false when not selected', () => {
    render(<TrackWorkoutOptionBtn {...makeProps({ isSelected: false })} />)

    expect(screen.getByRole('button', { name: /just right/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('should call onSelect with the id when clicked exactly once', () => {
    const onSelect = vi.fn()
    render(<TrackWorkoutOptionBtn {...makeProps({ onSelect })} />)

    const button = screen.getByRole('button', { name: /just right/i })
    button.click()

    expect(onSelect).toHaveBeenCalledWith('just-right')
    expect(onSelect).toHaveBeenCalledTimes(1)
  })
})
