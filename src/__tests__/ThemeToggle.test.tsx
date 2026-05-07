import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '~/components/ThemeToggle'

describe('ThemeToggle', () => {
  it('should render the theme toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument()
  })

  it('should not render the dropdown menu by default', () => {
    render(<ThemeToggle />)

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('should open the dropdown menu when the button is clicked and has the correct menu items', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    const dropdownTriggerBtn = screen.getByRole('button', { name: /theme/i })
    await user.click(dropdownTriggerBtn)

    expect(screen.getByRole('menuitem', { name: /light/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /dark/i })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: /system/i })).toBeInTheDocument()
  })
})
