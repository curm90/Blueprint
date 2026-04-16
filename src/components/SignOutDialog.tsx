import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog'
import { authClient } from '~/lib/auth-client'

export default function SignOutDialog() {
  const [isOpen, setIsOpen] = useState(false)

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
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          <LogOut />
          Sign out
        </Button>
      </DialogTrigger>
      <DialogContent className='flex flex-col gap-1'>
        <DialogTitle className='text-lg font-semibold'>Sign Out</DialogTitle>
        <p className='text-sm text-muted-foreground'>Are you sure you want to sign out?</p>
        <div className='flex items-center justify-end gap-2 mt-6'>
          <Button variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
