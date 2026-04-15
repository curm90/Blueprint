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

  console.log({ user })

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
    <form onSubmit={handleSave} className='max-w-180 mx-auto w-full'>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center gap-2'>
            <h2 className='text-xl'>Profile</h2>
            <Button type='submit' disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </div>
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
            <div className='flex flex-col gap-4'>
              <Label
                htmlFor='email'
                className='text-muted-foreground flex flex-col gap-2 justify-start items-start'
              >
                Email
                <Input id='email' placeholder='' value={user?.email || ''} readOnly />
              </Label>
              <div className='flex items-center justify-between gap-3'>
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
              </div>
            </div>
          </div>
          <div className='flex items-center gap-2 mt-8'>
            <Button variant='destructive' onClick={handleSignOut}>
              Sign out
            </Button>
            <Button variant='destructive'>Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
