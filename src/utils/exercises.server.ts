import { createServerFn } from '@tanstack/react-start'
import { addExercise } from './exercises.functions'

export const addExerciseServer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      name: string
      currentWeight: number
      startingWeight: number
      unit: string
      minReps: number
      maxReps: number
    }) => data,
  )
  .handler(async ({ data }) => {
    return await addExercise(data)
  })
