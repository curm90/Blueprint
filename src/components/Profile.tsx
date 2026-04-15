import { useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { authClient } from '~/lib/auth-client'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'
import { Label } from './ui/label'
import { CheckCircle, AlertCircle, Send } from 'lucide-react'

export default function Profile() {
  const { data: user } = useSuspenseQuery(convexQuery(api.auth.getCurrentUser, {}))
  const [verificationSent, setVerificationSent] = useState(false)
  const [sending, setSending] = useState(false)

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

  return (
    <form className='max-w-180 mx-auto w-full'>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center gap-2'>
            <h2 className='text-xl'>Profile</h2>
            <Button>Save</Button>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-2'>
              <Label className='text-muted-foreground'>Name</Label>
              <Input placeholder='' value={user?.name || ''} />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-muted-foreground'>Email</Label>
              <Input placeholder='' value={user?.email || ''} />
              {isVerified ? (
                <div className='flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400'>
                  <CheckCircle className='size-4' />
                  <span>Email verified</span>
                </div>
              ) : (
                <div className='flex flex-col gap-2'>
                  <div className='flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400'>
                    <AlertCircle className='size-4' />
                    <span>Email not verified</span>
                  </div>
                  {verificationSent ? (
                    <p className='text-sm text-muted-foreground'>
                      Verification email sent — check your inbox.
                    </p>
                  ) : (
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      disabled={sending}
                      onClick={handleSendVerification}
                    >
                      <Send data-icon='inline-start' className='size-3.5' />
                      {sending ? 'Sending…' : 'Send verification email'}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
