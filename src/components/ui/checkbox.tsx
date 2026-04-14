import * as React from 'react'

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className='flex items-center space-x-2 cursor-pointer'>
        <input
          type='checkbox'
          className='h-4 w-4 appearance-none rounded border border-input bg-background checked:bg-primary checked:border-primary focus:ring-ring focus:ring-2 relative checked:after:content-["✓"] checked:after:text-primary-foreground checked:after:text-[10px] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:font-bold'
          ref={ref}
          {...props}
        />
        {label && <span className='text-sm font-medium text-foreground'>{label}</span>}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
