import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  addExercise,
  deleteExercise,
  getExercises,
  getExercisesWithProgress,
  updateExercise,
} from './exercises.functions'
import type { ExerciseCreate } from '@/db/schema'
import { exerciseCreateSchema } from '@/db/schema'

export const addExerciseServer = createServerFn({ method: 'POST' })
  .inputValidator((data: ExerciseCreate) => exerciseCreateSchema.parse(data))
  .handler(async ({ data }) => {
    return await addExercise(data)
  })

export const getExercisesServer = createServerFn({ method: 'GET' }).handler(
  async () => {
    return await getExercises()
  },
)

export const getExercisesWithProgressServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await getExercisesWithProgress()
})

export const deleteExerciseServer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(({ data }) => {
    console.log('Deleting exercise with ID:', data.id)
    return deleteExercise(data.id)
  })

export const updateExerciseServer = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      id: z.number(),
      updates: exerciseCreateSchema.partial(), // Allow partial updates
    }),
  )
  .handler(async ({ data }) => {
    return await updateExercise(data.id, data.updates)
  })
