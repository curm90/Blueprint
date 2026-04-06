import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const addWorkout = mutation({
  args: {
    title: v.string(),
    selectedDays: v.array(v.string()),
    weightUnit: v.string(),
    exercises: v.array(
      v.object({
        exerciseTitle: v.string(),
        weight: v.number(),
        minReps: v.number(),
        maxReps: v.number(),
      }),
    ),
  },

  handler: async (ctx, args) => {
    const { title, selectedDays, weightUnit, exercises } = args
    console.log({ args })

    const id = await ctx.db.insert('workouts', {
      title,
      selectedDays,
      weightUnit,
      exercises,
    })

    console.log({ id })

    return id
  },
})

export const listWorkouts = query({
  args: {},
  handler: async (ctx) => {
    const workouts = await ctx.db.query('workouts').collect()

    return workouts
  },
})
