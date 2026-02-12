import { createServerFn } from '@tanstack/react-start'
import { addSessionLog } from './exercise-log.functions'
import { sessionLogCreateSchema } from '@/db/schema'

export const addSessionLogServer = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => sessionLogCreateSchema.parse(data))
  .handler(async ({ data }) => {
    return await addSessionLog(data.exerciseId, data)
  })
