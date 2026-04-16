import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { authClient } from '~/lib/auth-client'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Label } from './ui/label'
import ProfileImage from './ProfileImage'

export default function Profile() {
  const { data: user } = useSuspenseQuery(convexQuery(api.auth.getCurrentUser, {}))

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageRemoved, setImageRemoved] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(user?.name || '')

  const isVerified = user?.emailVerified

  async function handleSendVerification() {
    if (!user?.email) return
    setSending(true)
    try {
      await authClient.sendVerificationEmail({ email: user.email, callbackURL: '/' })
      setVerificationSent(true)
    } finally {
      setSending(false)
    }
  }

  async function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    try {
      const updates: { name: string; image?: string | null } = { name }
      if (imagePreview) {
        updates.image = imagePreview
      } else if (imageRemoved) {
        updates.image = null
      }
      await authClient.updateUser(updates)
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          location.reload()
        },
      },
    })
  }

  return (
    <div className='max-w-180 mx-auto w-full flex flex-col gap-4'>
      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <div className='flex justify-between items-center gap-2'>
              <h2 className='text-xl'>Profile</h2>
              <Button type='submit' disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
            <p className='text-sm text-muted-foreground'>
              Update your display name and profile image.
            </p>
          </CardHeader>
          <Separator />
          <CardContent>
            <div className='flex flex-col gap-6'>
              <ProfileImage
                image={user?.image}
                imagePreview={imagePreview}
                imageRemoved={imageRemoved}
                setImagePreview={setImagePreview}
                setImageRemoved={setImageRemoved}
              />
              <Separator />

              <Label className='text-muted-foreground flex flex-col gap-2 justify-start items-start'>
                Name
                <Input placeholder='' value={name} onChange={(e) => setName(e.target.value)} />
              </Label>
            </div>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <h2 className='text-xl'>Account</h2>
          <p className='text-sm text-muted-foreground'>
            Manage your email, password, and active session.
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className='flex flex-col gap-5'>
            <div className='flex flex-col gap-3'>
              <Label
                htmlFor='email'
                className='text-muted-foreground flex flex-col gap-2 justify-start items-start'
              >
                Email
                <Input id='email' placeholder='' value={user?.email || ''} readOnly />
              </Label>
              <div className='flex items-center justify-between gap-3'>
                {isVerified ? (
                  <div className='flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400'>
                    <CheckCircle className='size-4' />
                    <span>Email verified</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400'>
                    <AlertCircle className='size-4' />
                    <span>Email not verified</span>
                  </div>
                )}

                {isVerified ? (
                  <Button type='button' variant='outline' size='sm' disabled>
                    Change email
                  </Button>
                ) : (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    disabled={sending || verificationSent}
                    onClick={handleSendVerification}
                  >
                    <Send data-icon='inline-start' className='size-3.5' />
                    {verificationSent
                      ? 'Verification email sent'
                      : sending
                        ? 'Sending…'
                        : 'Verify email'}
                  </Button>
                )}
              </div>
              {!isVerified && verificationSent && (
                <p className='text-sm text-muted-foreground'>
                  Verification email sent. Check your inbox and spam folder.
                </p>
              )}
            </div>

            <Separator />

            <div className='flex items-center justify-between gap-3'>
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>Password</span>
                <span className='text-sm text-muted-foreground'>
                  Update your password using your account security flow.
                </span>
              </div>
              <Button type='button' variant='outline' size='sm' disabled>
                Change password
              </Button>
            </div>

            <Separator />

            <div className='flex items-center justify-between gap-3'>
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>Session</span>
                <span className='text-sm text-muted-foreground'>Sign out on this device.</span>
              </div>
              <Button type='button' variant='outline' size='sm' onClick={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='border border-destructive/20 bg-destructive/5'>
        <CardHeader>
          <h2 className='text-xl text-destructive'>Danger zone</h2>
          <p className='text-sm text-destructive/80'>
            Deleting your account is permanent and cannot be undone.
          </p>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className='flex flex-col gap-4'>
            <p className='text-sm text-muted-foreground'>
              This will remove your profile and account access. You will need to create a new account
              to return.
            </p>
            <div className='flex justify-end'>
              <Button type='button' variant='destructive' disabled>
                Delete account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
