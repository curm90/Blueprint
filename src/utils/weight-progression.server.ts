import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import {
  applyWeightProgression,
  calculateWeightProgression,
  getProgressionSuggestions,
} from './weight-progression.functions'

export const calculateWeightProgressionServer = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ exerciseId: z.number() }))
  .handler(async ({ data }) => {
    return await calculateWeightProgression(data.exerciseId)
  })

export const applyWeightProgressionServer = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ exerciseId: z.number() }))
  .handler(async ({ data }) => {
    return await applyWeightProgression(data.exerciseId)
  })

export const getProgressionSuggestionsServer = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await getProgressionSuggestions()
})

export const applyAllProgressionsServer = createServerFn({
  method: 'POST',
}).handler(async () => {
  const suggestions = await getProgressionSuggestions()

  const results = await Promise.all(
    suggestions.map(async ({ exercise }) => ({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      result: await applyWeightProgression(exercise.id),
    })),
  )

  return {
    applied: results.length,
    details: results,
  }
})
