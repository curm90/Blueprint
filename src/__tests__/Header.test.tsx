import { render, screen, within } from '@testing-library/react'
import Header from '~/components/Header'
import { DEFAULT_AVATAR } from '~/lib/constants'

const mockUserQuery = vi.hoisted(() => vi.fn())

vi.mock('@tanstack/react-query', () => ({
  useQuery: mockUserQuery,
}))

vi.mock('@convex-dev/react-query', () => ({
  convexQuery: (fn: any, args: any) => ({ queryKey: [fn, args] }),
}))

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()

  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  }
})

vi.mock('@unpic/react', () => ({
  Image: ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

vi.mock('~/components/ThemeToggle', () => ({
  default: () => <button>Theme</button>,
}))

vi.mock('~/components/ui/separator', () => ({
  Separator: ({
    orientation,
    className,
  }: {
    orientation: 'vertical' | 'horizontal'
    className?: string
  }) => <div className={className}>{orientation === 'vertical' ? '|' : '-'}</div>,
}))

beforeEach(() => {
  mockUserQuery.mockReset()
  mockUserQuery.mockReturnValue({ data: { image: DEFAULT_AVATAR } })
})

describe('Header', () => {
  it('should render the blueprint logo and title', () => {
    render(<Header />)

    expect(screen.getByRole('heading', { name: /blueprint/i })).toBeInTheDocument()
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument()
  })

  it('should render correct number of navigation links and correct href for each', () => {
    render(<Header />)

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(5) // 4 nav links + profile link

    expect(screen.getByRole('link', { name: /today/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /workouts/i })).toHaveAttribute('href', '/workouts')
    expect(screen.getByRole('link', { name: /progress/i })).toHaveAttribute('href', '/progress')
    expect(screen.getByRole('link', { name: /profile/i })).toHaveAttribute('href', '/profile')
  })

  it('should render the theme toggle button', () => {
    render(<Header />)

    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument()
  })

  it('should display user avatar when available', () => {
    mockUserQuery.mockReturnValue({ data: { image: 'my-avatar.png' } })
    render(<Header />)

    const profileImage = screen.getByAltText(/profile/i) as HTMLImageElement
    expect(profileImage).toHaveAttribute('src', 'my-avatar.png')
  })

  it('should fall back to default avatar when user has no image', () => {
    mockUserQuery.mockReturnValue({ data: { image: undefined } })
    render(<Header />)

    const profileImage = screen.getByAltText(/profile/i) as HTMLImageElement
    expect(profileImage).toHaveAttribute('src', DEFAULT_AVATAR)
  })

  it('should not render a "Profile" label in the desktop nav', () => {
    render(<Header />)

    // The nav list should not have a text link labelled "Profile"
    const navList = screen.getByRole('list')
    const navLinks = within(navList).queryAllByRole('link')
    const profileNavLink = navLinks.find((link) => /profile/i.test(link.textContent ?? ''))
    expect(profileNavLink).toBeUndefined()

    // But the profile avatar link to /profile should still exist
    expect(screen.getByTitle('Profile')).toHaveAttribute('href', '/profile')
  })
})
