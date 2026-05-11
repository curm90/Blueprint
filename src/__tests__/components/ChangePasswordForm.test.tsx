import { render, screen, within } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ChangePasswordForm from '~/components/ChangePasswordForm'

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
})
