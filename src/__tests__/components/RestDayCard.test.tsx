import { render, screen } from '@testing-library/react'
import RestDayCard from '~/components/RestDayCard'

vi.mock('~/components/CreateWorkoutForm', () => ({
  CreateWorkoutForm: () => <button>Create Workout</button>,
}))

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    children,
    to,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

describe('RestDayCard', () => {
  it('renders the RestDayCard component with correct content', () => {
    render(<RestDayCard />)

    expect(screen.getByRole('heading', { name: /rest day/i })).toBeInTheDocument()
    expect(
      screen.getByText('No workouts scheduled for today. Enjoy the recovery!'),
    ).toBeInTheDocument()
  })

  it('renders the "View all workouts" link', () => {
    render(<RestDayCard />)

    const linkElement = screen.getByRole('link', { name: /view all workouts/i })
    expect(linkElement).toBeInTheDocument()
  })

  it('renders the "Create Workout" button', () => {
    render(<RestDayCard />)

    const buttonElement = screen.getByRole('button', { name: /create workout/i })
    expect(buttonElement).toBeInTheDocument()
  })
})
