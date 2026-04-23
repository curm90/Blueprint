import { CheckCircle } from 'lucide-react'

export default function DoneBadge() {
  return (
    <div className='flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1'>
      <CheckCircle className='size-3.5 text-emerald-500' />
      <span className='text-xs font-medium text-emerald-500'>Done</span>
    </div>
  )
}
