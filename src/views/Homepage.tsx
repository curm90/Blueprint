import { Folder } from 'lucide-react'
import { EmptyUI } from '~/components/EmptyUI'
import PageTitle from '~/components/PageTitle'
import { Card, CardContent } from '~/components/ui/card'

export default function Homepage() {
  const todayDate = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return (
    <div className='flex flex-col gap-8 mx-auto w-full'>
      <PageTitle title={`Today's workout`} subtitle={todayDate} />
      <Card className='bg-secondary'>
        <CardContent>
          <EmptyUI
            title='No Workouts Scheduled for Today'
            description="It looks like you don't have any workouts planned for today. Let's get moving and add a workout to your schedule!"
            buttonText='Create Workout'
            icon={<Folder />}
          />
        </CardContent>
      </Card>
    </div>
  )
}
