import { Calendar, Dumbbell } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import ExercisesTab from './ExercisesTab'
import WorkoutsTab from './WorkoutsTab'
import { useWorkouts } from '@/hooks/workouts.query'

export default function Home({ exercises }: { exercises: any }) {
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts()

  if (workoutsLoading) {
    return (
      <div className="mx-auto my-10 max-w-6xl px-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading workouts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto my-10 max-w-6xl px-6">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your Fitness Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track exercises and manage workout routines
          </p>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="exercises" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-75 grid-cols-2">
              <TabsTrigger
                value="exercises"
                className="flex items-center gap-2"
              >
                <Dumbbell className="h-4 w-4" />
                Exercises
              </TabsTrigger>
              <TabsTrigger value="workouts" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Workouts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="exercises">
            <ExercisesTab exercises={exercises || []} />
          </TabsContent>

          <TabsContent value="workouts">
            <WorkoutsTab workouts={workouts || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
