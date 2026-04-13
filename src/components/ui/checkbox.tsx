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
          className='h-4 w-4 rounded border border-input text-primary focus:ring-ring focus:ring-2'
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
