import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

export const trackWorkout = mutation({
  args: {
    workoutId: v.id('workouts'),
    results: v.array(
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
  },
  handler: async (ctx, args) => {
    const { workoutId, results } = args

    // Insert the completion record
    await ctx.db.insert('workoutCompletions', {
      workoutId,
      completedAt: Date.now(),
      exercises: results.map((result) => ({
        exerciseTitle: result.exerciseTitle,
        feedback: result.feedback,
      })),
    })

    // Update the workout's exercise weights based on feedback
    const workout = await ctx.db.get(workoutId)
    if (!workout) return

    // For "just-right", check if last 3 completions are all "just-right"
    const recentCompletions = await ctx.db
      .query('workoutCompletions')
      .withIndex('by_workout', (q) => q.eq('workoutId', workoutId))
      .order('desc')
      .take(3)

    const updatedExercises = workout.exercises.map((exercise) => {
      const result = results.find((r) => r.exerciseTitle === exercise.exerciseTitle)
      if (!result) return exercise

      let newWeight = exercise.weight

      if (result.feedback === 'too-easy') {
        newWeight = exercise.weight + 2.5
      } else if (result.feedback === 'too-hard') {
        newWeight = Math.max(0, exercise.weight - 2.5)
      } else if (result.feedback === 'just-right') {
        // Check if last 3 completions (including this one) are all "just-right"
        const consecutiveJustRight = recentCompletions.every((completion) => {
          const ex = completion.exercises.find((e) => e.exerciseTitle === exercise.exerciseTitle)
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
    const completions = await ctx.db
      .query('workoutCompletions')
      .withIndex('by_completion', (q) => q.gte('completedAt', args.startOfDay))
      .collect()
    return completions
  },
})

export const getWorkoutStats = query({
  args: {},
  handler: async (ctx) => {
    const allCompletions = await ctx.db.query('workoutCompletions').collect()

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
