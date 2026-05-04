import { render, screen, fireEvent, within } from '@testing-library/react'
import { authClient } from '~/lib/auth-client'
import SignOutDialog from '~/components/SignOutDialog'

vi.mock('~/lib/auth-client', () => ({
  authClient: {
    signOut: vi.fn(),
  },
}))

const mockSignOut = vi.mocked(authClient.signOut)

describe('SignOutDialog', () => {
  it('renders the dialog trigger button', () => {
    render(<SignOutDialog />)

    const triggerButton = screen.getByRole('button', { name: /sign out/i })
    expect(triggerButton).toBeInTheDocument()
  })

  it('opens the dialog when the trigger button is clicked', () => {
    render(<SignOutDialog />)

    const triggerButton = screen.getByRole('button', { name: /sign out/i })
    fireEvent.click(triggerButton)

    const dialogTitle = screen.getByRole('heading', { name: /sign out/i })
    expect(dialogTitle).toBeInTheDocument()
  })

  it('should close the dialog when the cancel button is clicked', () => {
    render(<SignOutDialog />)

    const triggerButton = screen.getByRole('button', { name: /sign out/i })
    fireEvent.click(triggerButton)

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    fireEvent.click(cancelButton)

    expect(screen.queryByRole('heading', { name: /sign out/i })).not.toBeInTheDocument()
  })

  it('should call handleSignOut when the sign out button is clicked', async () => {
    mockSignOut.mockResolvedValue(undefined)

    render(<SignOutDialog />)

    const triggerButton = screen.getByRole('button', { name: /sign out/i })
    fireEvent.click(triggerButton)

    const dialog = screen.getByRole('dialog')
    const signOutButton = within(dialog).getByRole('button', { name: /^sign out$/i })
    fireEvent.click(signOutButton)

    expect(authClient.signOut).toHaveBeenCalled()
    expect(authClient.signOut).toHaveBeenCalledWith({
      fetchOptions: {
        onSuccess: expect.any(Function),
      },
    })
  })
})
