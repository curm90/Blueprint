import { v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { getAuthUserId, getAuthUserIdOrNull } from './helpers'

export const trackWorkout = mutation({
  args: {
    workoutId: v.id('workouts'),
    results: v.array(
      v.object({
        id: v.string(),
        exerciseTitle: v.string(),
        feedback: v.union(
          v.null(),
          v.literal('too-easy'),
          v.literal('just-right'),
          v.literal('too-hard'),
        ),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    const { workoutId, results } = args

    // Verify the workout belongs to the current user
    const workout = await ctx.db.get(workoutId)
    if (!workout || workout.userId !== userId) {
      throw new Error('Workout not found')
    }

    // Insert the completion record
    await ctx.db.insert('workoutCompletions', {
      userId,
      workoutId,
      completedAt: Date.now(),
      exercises: results.map((result) => ({
        id: result.id,
        exerciseTitle: result.exerciseTitle,
        feedback: result.feedback,
      })),
    })

    // For "just-right", check if last 3 completions are all "just-right"
    const recentCompletions = await ctx.db
      .query('workoutCompletions')
      .withIndex('by_userId_and_workout', (q) => q.eq('userId', userId).eq('workoutId', workoutId))
      .order('desc')
      .take(3)

    const updatedExercises = workout.exercises.map((exercise) => {
      const result = results.find((r) => r.id === exercise.id)
      if (!result) return exercise

      let newWeight = exercise.weight

      if (result.feedback === 'too-easy') {
        newWeight = exercise.weight + 2.5
      } else if (result.feedback === 'too-hard') {
        newWeight = Math.max(0, exercise.weight - 2.5)
      } else if (result.feedback === 'just-right') {
        // Check if last 3 completions (including this one) are all "just-right"
        const consecutiveJustRight = recentCompletions.every((completion) => {
          const ex = completion.exercises.find((e) => e.id === exercise.id)
          return ex?.feedback === 'just-right'
        })

        if (recentCompletions.length >= 3 && consecutiveJustRight) {
          newWeight = exercise.weight + 2.5
        }
      }

      return { ...exercise, weight: newWeight }
    })

    await ctx.db.patch(workoutId, { exercises: updatedExercises })
  },
})

export const getTodaysCompletions = query({
  args: {
    startOfDay: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserIdOrNull(ctx)
    if (!userId) return []
    const completions = await ctx.db
      .query('workoutCompletions')
      .withIndex('by_userId_and_completion', (q) =>
        q.eq('userId', userId).gte('completedAt', args.startOfDay),
      )
      .collect()
    return completions
  },
})

export const getWorkoutStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserIdOrNull(ctx)
    if (!userId) {
      return {
        totalCompletions: 0,
        completionsByWorkout: {},
        lastCompletedByWorkout: {},
        streak: 0,
        thisWeekCompletions: 0,
      }
    }
    const allCompletions = await ctx.db
      .query('workoutCompletions')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    // Total completions across all workouts
    const totalCompletions = allCompletions.length

    // Completions per workout
    const completionsByWorkout: Record<string, number> = {}
    const lastCompletedByWorkout: Record<string, number> = {}
    for (const c of allCompletions) {
      const wid = c.workoutId as string
      completionsByWorkout[wid] = (completionsByWorkout[wid] ?? 0) + 1
      if (!lastCompletedByWorkout[wid] || c.completedAt > lastCompletedByWorkout[wid]) {
        lastCompletedByWorkout[wid] = c.completedAt
      }
    }

    // Current streak: consecutive days (going backwards from today) with at least one completion
    const completionDays = new Set(
      allCompletions.map((c) => {
        const d = new Date(c.completedAt)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      }),
    )
    let streak = 0
    const now = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      if (completionDays.has(key)) {
        streak++
      } else {
        // Allow skipping today if it's still in progress
        if (i === 0) continue
        break
      }
    }

    // This week's completions
    const startOfWeek = new Date(now)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    const thisWeekCompletions = allCompletions.filter(
      (c) => c.completedAt >= startOfWeek.getTime(),
    ).length

    return {
      totalCompletions,
      completionsByWorkout,
      lastCompletedByWorkout,
      streak,
      thisWeekCompletions,
    }
  },
})
