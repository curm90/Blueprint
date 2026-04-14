import { query } from './_generated/server'
import { getAuthUserIdOrNull } from './helpers'

export const listExerciseProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserIdOrNull(ctx)
    if (!userId) return []
    const workouts = await ctx.db
      .query('workouts')
      .withIndex('by_userId', (q) => q.eq('userId', userId))
      .collect()

    return workouts.flatMap((workout) =>
      workout.exercises.map((exercise) => ({
        exerciseTitle: exercise.exerciseTitle,
        workoutTitle: workout.title,
        weightUnit: workout.weightUnit,
        currentWeight: exercise.weight,
        startingWeight: exercise.startingWeight,
        progressWeight: exercise.weight - exercise.startingWeight,
        progressPercentage:
          exercise.startingWeight === 0
            ? 0
            : Math.round(
                ((exercise.weight - exercise.startingWeight) / exercise.startingWeight) * 100,
              ),
      })),
    )
  },
})
