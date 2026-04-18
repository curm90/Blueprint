import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { authClient } from '~/lib/auth-client'
import { changePasswordSchema } from '~/lib/schemas'

async function changeUserPassword(values: ChangePasswordValues) {
  const result = await authClient.changePassword({
    currentPassword: values.currentPassword,
    newPassword: values.newPassword,
    revokeOtherSessions: true,
  })

  if (result.error) {
    throw new Error(result.error.message ?? 'Unable to change password.')
  }
}

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    validators: {
      onSubmit: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitError(null)
        await changeUserPassword(value)
        form.reset()
        setOpen(false)
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'Unable to change password.')
      }
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setSubmitError(null)
          form.reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button type='button' variant='outline' size='sm'>
          Change password
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>Update your account password.</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name='currentPassword'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Current Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='Enter your current password'
                      autoComplete='current-password'
                      type='password'
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name='newPassword'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='Enter your new password'
                      autoComplete='new-password'
                      type='password'
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
            <form.Field
              name='confirmNewPassword'
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Confirm New Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder='Confirm your new password'
                      autoComplete='new-password'
                      type='password'
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          </FieldGroup>
          {submitError && <p className='mt-4 text-sm text-destructive'>{submitError}</p>}
          <DialogFooter className='mt-6'>
            <Field orientation='horizontal'>
              <Button type='button' variant='outline' onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type='submit'>Submit</Button>
            </Field>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
