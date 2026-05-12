import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ChangePasswordForm from '~/components/ChangePasswordForm'

const mockChangePassword = vi.fn().mockResolvedValue(undefined)

vi.mock('~/lib/auth-client', () => ({
  authClient: {
    changePassword: (values: any) => mockChangePassword(values),
  },
}))

describe('ChangePasswordForm', () => {
  it('should render the trigger button', () => {
    render(<ChangePasswordForm />)

    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument()
  })

  it('should open the dialog when trigger button is clicked', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm />)

    const triggerBtn = screen.getByRole('button', { name: /change password/i })
    await user.click(triggerBtn)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
  })

  it('should close the dialog when escape key is pressed', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm />)

    const triggerBtn = screen.getByRole('button', { name: /change password/i })
    await user.click(triggerBtn)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()

    // Simulate pressing the Escape key to close the dialog
    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should close the dialog when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm />)

    const triggerBtn = screen.getByRole('button', { name: /change password/i })
    await user.click(triggerBtn)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()

    const closeBtn = screen.getByRole('button', { name: /close/i })
    await user.click(closeBtn)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should show all form fields with correct labels', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm />)

    const triggerBtn = screen.getByRole('button', { name: /change password/i })
    await user.click(triggerBtn)

    const inputs = screen.getAllByPlaceholderText(/password/i)
    expect(inputs).toHaveLength(3)
  })

  it('should call authclient changeUserPassword with correct values on form submission', async () => {
    const user = userEvent.setup()
    render(<ChangePasswordForm />)

    const triggerBtn = screen.getByRole('button', { name: /change password/i })
    await user.click(triggerBtn)

    const currentPasswordInput = screen.getByLabelText(/current password/i)
    const newPasswordInput = screen.getByLabelText(/^new password/i)
    const confirmNewPasswordInput = screen.getByLabelText(/confirm new password/i)
    const submitBtn = screen.getByRole('button', { name: /submit/i })

    await user.type(currentPasswordInput, 'oldpassword')
    await user.type(newPasswordInput, 'newpassword')
    await user.type(confirmNewPasswordInput, 'newpassword')
    await user.click(submitBtn)

    expect(mockChangePassword).toHaveBeenCalledWith({
      currentPassword: 'oldpassword',
      newPassword: 'newpassword',
      revokeOtherSessions: true,
    })
  })
})
