import { Check, type LucideIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

type TrackWorkoutOptionBtnProps = {
  id: FeedbackOption
  title: string
  setSelectedOption: (option: FeedbackOption) => void
  selectedOption: FeedbackOption
  icon: LucideIcon
  buttonClassName: string
  iconColor: string
  description: string
}

export default function TrackWorkoutOptionBtn({
  id,
  title,
  setSelectedOption,
  selectedOption,
  icon: Icon,
  buttonClassName,
  iconColor,
  description,
}: TrackWorkoutOptionBtnProps) {
  return (
    <button
      type='button'
      onClick={() => setSelectedOption(id)}
      className={cn(
        'flex h-auto items-center justify-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
        selectedOption === id ? buttonClassName : 'hover:bg-muted',
      )}
    >
      <Icon className={cn('size-4 shrink-0', iconColor)} />
      <div>
        <span className='font-medium'>{title}</span>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
      {selectedOption === id && <Check className={cn('ml-auto size-4', iconColor)} />}
    </button>
  )
}
