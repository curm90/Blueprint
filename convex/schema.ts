import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),

  workouts: defineTable({
    title: v.string(),
    selectedDays: v.array(v.string()), // ['monday', 'tuesday', etc.]
    weightUnit: v.string(), // 'kg' or 'lbs'
    exercises: v.array(
      v.object({
        exerciseTitle: v.string(),
        startingWeight: v.number(),
        weight: v.number(),
        minReps: v.number(),
        maxReps: v.number(),
      }),
    ),
  }),

  workoutCompletions: defineTable({
    workoutId: v.id('workouts'),
    completedAt: v.number(),
    exercises: v.array(
      v.object({
        exerciseTitle: v.string(),
        feedback: v.union(
          v.null(),
          v.literal('too-easy'),
          v.literal('just-right'),
          v.literal('too-hard'),
        ),
      }),
    ),
  })
    .index('by_workout', ['workoutId'])
    .index('by_completion', ['completedAt']),
})
