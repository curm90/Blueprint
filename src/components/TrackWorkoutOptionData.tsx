import { Check, TrendingDown, TrendingUp } from 'lucide-react'

export default [
  {
    id: 'too-easy' as FeedbackOption,
    title: 'Too Easy',
    description: 'Add 2.5kg next workout',
    buttonClassName: 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400',
    iconColor: 'text-green-500',
    icon: TrendingUp,
  },
  {
    id: 'just-right' as FeedbackOption,
    title: 'Just Right',
    description: '3× in a row → increase weight',
    buttonClassName: 'border-orange-500 bg-orange-500/10 text-orange-700 dark:text-orange-400',
    iconColor: 'text-orange-500',
    icon: Check,
  },
  {
    id: 'too-hard' as FeedbackOption,
    title: 'Too Hard',
    description: 'Decrease by 2.5kg next workout',
    buttonClassName: 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400',
    iconColor: 'text-red-500',
    icon: TrendingDown,
  },
]
