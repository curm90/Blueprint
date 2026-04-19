import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  workouts: defineTable({
    userId: v.string(),
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
        sets: v.number(),
      }),
    ),
  }).index('by_userId', ['userId']),

  workoutCompletions: defineTable({
    userId: v.string(),
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
    .index('by_userId', ['userId'])
    .index('by_userId_and_workout', ['userId', 'workoutId'])
    .index('by_userId_and_completion', ['userId', 'completedAt']),
})
