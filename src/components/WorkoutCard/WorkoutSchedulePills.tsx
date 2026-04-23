import { DAYS_OF_WEEK } from '~/lib/constants'

export default function WorkoutSchedulePills({ selectedDays }: { selectedDays: string[] }) {
  return (
    <div className='flex flex-wrap gap-1.5'>
      {selectedDays.map((day) => (
        <span
          key={day}
          className='rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary'
        >
          <span className='sm:hidden'>
            {DAYS_OF_WEEK.find((dayOption) => dayOption.value === day)?.shortLabel ?? day}
          </span>
          <span className='hidden sm:inline'>
            {DAYS_OF_WEEK.find((dayOption) => dayOption.value === day)?.label ?? day}
          </span>
        </span>
      ))}
    </div>
  )
}
