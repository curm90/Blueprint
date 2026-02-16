import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  addWorkout,
  completeWorkoutSession,
  deleteWorkout,
  getExerciseTemplates,
  getTodaysWorkouts,
  getWorkoutById,
  getWorkoutExercisesWithProgress,
  getWorkouts,
  isWorkoutCompletedToday,
  logWorkoutComplete,
  startWorkoutSession,
  updateWorkout,
} from './workouts.functions'
import type { WorkoutCreate } from '@/db/schema'
import { workoutCreateSchema } from '@/db/schema'

export const addWorkoutServer = createServerFn({ method: 'POST' })
  .inputValidator((data: WorkoutCreate) => workoutCreateSchema.parse(data))
  .handler(async ({ data }) => {
    return await addWorkout(data)
  })

export const getWorkoutsServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await getWorkouts()
  },
)

export const getWorkoutByIdServer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    return await getWorkoutById(data.id)
  })

export const getTodaysWorkoutsServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await getTodaysWorkouts()
})

export const deleteWorkoutServer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(({ data }) => {
    console.log('Deleting workout with ID:', data.id)
    return deleteWorkout(data.id)
  })

export const updateWorkoutServer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.number(),
      updates: workoutCreateSchema.partial(), // Allow partial updates
    }),
  )
  .handler(async ({ data }) => {
    return await updateWorkout(data.id, data.updates)
  })

export const logWorkoutCompleteServer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      workoutId: z.number(),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    return await logWorkoutComplete(data.workoutId, data.notes)
  })

export const getExerciseTemplatesServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await getExerciseTemplates()
})

export const isWorkoutCompletedTodayServer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ workoutId: z.number() }))
  .handler(async ({ data }) => {
    return await isWorkoutCompletedToday(data.workoutId)
  })

export const getWorkoutExercisesWithProgressServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await getWorkoutExercisesWithProgress()
})

export const startWorkoutSessionServer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      workoutId: z.number(),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    return await startWorkoutSession(data.workoutId, data.notes)
  })

export const completeWorkoutSessionServer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      workoutLogId: z.number(),
      notes: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    return await completeWorkoutSession(data.workoutLogId, data.notes)
  })
