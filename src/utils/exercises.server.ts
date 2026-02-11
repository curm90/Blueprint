import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  addExercise,
  deleteExercise,
  getExercises,
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

export const deleteExerciseServer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(({ data }) => {
    return deleteExercise(data.id)
  })
