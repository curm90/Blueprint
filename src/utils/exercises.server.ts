import { createServerFn } from '@tanstack/react-start'
import { addExercise } from './exercises.functions'
import type { ExerciseCreate } from '@/db/schema'
import { exerciseCreateSchema } from '@/db/schema'

export const addExerciseServer = createServerFn({ method: 'POST' })
  .inputValidator((data: ExerciseCreate) => exerciseCreateSchema.parse(data))
  .handler(async ({ data }) => {
    return await addExercise(data)
  })
