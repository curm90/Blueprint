import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getAuthUserId, getAuthUserIdOrNull } from './helpers'

export const addWorkout = mutation({
  args: {
    title: v.string(),
    selectedDays: v.array(v.string()),
    weightUnit: v.string(),
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
  },

  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const { title, selectedDays, weightUnit, exercises } = args

    const id = await ctx.db.insert('workouts', {
      userId,
      title,
      selectedDays,
      weightUnit,
      exercises,
    })

    return id
  },
})

export const listWorkouts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserIdOrNull(ctx)
    if (!userId) return []
    const workouts = await ctx.db
      .query('workouts')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    return workouts
  },
})

export const deleteWorkoutById = mutation({
  args: {
    id: v.id('workouts'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const { id } = args

    const workout = await ctx.db.get(id)
    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found')
    }

    // Delete all completions for this workout
    const completions = await ctx.db
      .query('workoutCompletions')
      .withIndex('by_userId_and_workout', (q) => q.eq('userId', userId).eq('workoutId', id))
      .collect()
    for (const completion of completions) {
      await ctx.db.delete(completion._id)
    }

    await ctx.db.delete(id)
  },
})

export const editWorkoutById = mutation({
  args: {
    id: v.id('workouts'),
    updates: v.object({
      title: v.string(),
      selectedDays: v.array(v.string()),
      weightUnit: v.string(),
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
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const { id, updates } = args

    const workout = await ctx.db.get(id)
    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found')
    }

    await ctx.db.patch(id, updates)
  },
})
