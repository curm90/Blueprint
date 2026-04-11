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
