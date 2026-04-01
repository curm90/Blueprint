import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const addWorkout = mutation({
  args: {
    title: v.string(),
    weight: v.number(),
    minReps: v.number(),
    maxReps: v.number(),
  },

  handler: async (ctx, args) => {
    const { title, weight, minReps, maxReps } = args
    console.log({ args })

    const id = await ctx.db.insert('workouts', {
      title,
      weight,
      minReps,
      maxReps,
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
