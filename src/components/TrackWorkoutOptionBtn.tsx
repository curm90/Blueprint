import { Check } from 'lucide-react'
import { cn } from '~/lib/utils'

export default function TrackWorkoutOptionBtn({
  id,
  title,
  onSelect,
  isSelected,
  icon: Icon,
  buttonClassName,
  iconColor,
  description,
}: TrackWorkoutOptionBtnProps) {
  return (
    <button
      type='button'
      aria-pressed={isSelected}
      onClick={() => onSelect(id)}
      className={cn(
        'flex h-auto items-center justify-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors',
        isSelected ? buttonClassName : 'hover:bg-muted',
      )}
    >
      <Icon className={cn('size-4 shrink-0', iconColor)} />
      <div>
        <span className='font-medium'>{title}</span>
        <p className='text-xs text-muted-foreground'>{description}</p>
      </div>
      {isSelected && <Check className={cn('ml-auto size-4', iconColor)} />}
    </button>
  )
}
