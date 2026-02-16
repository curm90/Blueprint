import { PlusIcon } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

type EmptyOutlineProps = {
  title?: string
  description?: string
  buttonText?: string
  onClick?: () => void
}

export default function EmptyOutline({
  title,
  description,
  buttonText,
  onClick,
}: EmptyOutlineProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyTitle>{title || 'No Planned Exercises'}</EmptyTitle>
        <EmptyDescription>
          {description || 'Add your first exercise to get started.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm" onClick={onClick}>
          <PlusIcon className="h-4 w-4" />
          {buttonText || 'Add Your First Exercise'}
        </Button>
      </EmptyContent>
    </Empty>
  )
}
