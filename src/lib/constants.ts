import { linkOptions } from '@tanstack/react-router'
import { Calendar, Dumbbell, TrendingUp, type LucideIcon } from 'lucide-react'

export const DAYS_OF_WEEK = [
  { value: 'monday', shortLabel: 'Mon', label: 'Monday' },
  { value: 'tuesday', shortLabel: 'Tue', label: 'Tuesday' },
  { value: 'wednesday', shortLabel: 'Wed', label: 'Wednesday' },
  { value: 'thursday', shortLabel: 'Thu', label: 'Thursday' },
  { value: 'friday', shortLabel: 'Fri', label: 'Friday' },
  { value: 'saturday', shortLabel: 'Sat', label: 'Saturday' },
  { value: 'sunday', shortLabel: 'Sun', label: 'Sunday' },
]

export const links: Link[] = linkOptions([
  {
    to: '/',
    label: 'Today',
    icon: Calendar,
  },
  {
    to: '/workouts',
    label: 'Workouts',
    icon: Dumbbell,
  },
  {
    to: '/progress',
    label: 'Progress',
    icon: TrendingUp,
  },
])
