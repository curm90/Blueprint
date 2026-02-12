import z from 'zod'
import { createServerFn } from '@tanstack/react-start'
import {
  addSessionLog,
  getSessionLogsForExercise,
} from './exercise-log.functions'
import { sessionLogCreateSchema } from '@/db/schema'

export const addSessionLogServer = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => sessionLogCreateSchema.parse(data))
  .handler(async ({ data }) => {
    return await addSessionLog(data.exerciseId, data)
  })

export const getSessionLogsForExerciseServer = createServerFn({
  method: 'GET',
})
  .inputValidator((data: unknown) => {
    return z.object({ exerciseId: z.number().positive() }).parse(data)
  })
  .handler(async ({ data }) => {
    const { exerciseId } = data
    return await getSessionLogsForExercise(exerciseId)
  })
