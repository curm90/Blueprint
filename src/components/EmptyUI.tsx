import { Dumbbell } from 'lucide-react'
import { Button } from '~/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty'

type EmptyUIProps = {
  title: string
  description: string
  buttonText: string
  icon?: React.ReactNode
}

export function EmptyUI({ title, description, buttonText, icon }: EmptyUIProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia className='bg-background' variant='icon'>
          {icon || <Dumbbell />}
        </EmptyMedia>
        <EmptyTitle className='text-xl'>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center gap-2'>
        <Button>{buttonText}</Button>
      </EmptyContent>
    </Empty>
  )
}
