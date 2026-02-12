import { desc, eq } from 'drizzle-orm'
import type { Exercise, SessionLog } from '@/db/schema'
import { db } from '@/db'
import { exercises, sessionLog } from '@/db/schema'

type ProgressionResult = {
  newWeight: number
  reason: string
  shouldUpdate: boolean
}

/**
 * Calculate weight progression for an exercise based on session logs
 */
export async function calculateWeightProgression(
  exerciseId: number,
): Promise<ProgressionResult> {
  // Get the exercise and its recent session logs
  const exercise = await db.query.exercises.findFirst({
    where: eq(exercises.id, exerciseId),
    with: {
      sessionLogs: {
        orderBy: desc(sessionLog.loggedAt),
        limit: 5, // Look at last 5 sessions for pattern analysis
      },
    },
  })

  if (!exercise || !exercise.sessionLogs.length) {
    return {
      newWeight: exercise?.currentWeight || 0,
      reason: 'No session data available',
      shouldUpdate: false,
    }
  }

  const logs = exercise.sessionLogs
  const latestLog = logs[0]
  const currentWeight = exercise.currentWeight
  const increment = exercise.weightIncrement

  // Algorithm logic
  switch (latestLog.difficulty) {
    case 'easy':
      return {
        newWeight: currentWeight + increment,
        reason: 'Last session was too easy - increasing weight',
        shouldUpdate: true,
      }

    case 'hard':
      return {
        newWeight: Math.max(currentWeight - increment, exercise.startingWeight),
        reason: 'Last session was too hard - decreasing weight',
        shouldUpdate: true,
      }

    case 'right': {
      // Check for consecutive "just right" sessions
      const consecutiveRightCount = getConsecutiveRightCount(logs)

      if (consecutiveRightCount >= 3) {
        return {
          newWeight: currentWeight + increment,
          reason: `${consecutiveRightCount} consecutive "just right" sessions - time to progress`,
          shouldUpdate: true,
        }
      }

      return {
        newWeight: currentWeight,
        reason: `Session felt right (${consecutiveRightCount}/3 consecutive)`,
        shouldUpdate: false,
      }
    }

    default:
      return {
        newWeight: currentWeight,
        reason: 'Unknown difficulty level',
        shouldUpdate: false,
      }
  }
}

/**
 * Count consecutive "right" difficulty sessions from most recent
 */
function getConsecutiveRightCount(logs: Array<SessionLog>): number {
  let count = 0

  for (const log of logs) {
    if (log.difficulty === 'right') {
      count++
    } else {
      break // Stop counting when we hit a non-"right" session
    }
  }

  return count
}

/**
 * Apply weight progression to an exercise
 */
export async function applyWeightProgression(
  exerciseId: number,
): Promise<ProgressionResult> {
  const progression = await calculateWeightProgression(exerciseId)

  if (progression.shouldUpdate) {
    await db
      .update(exercises)
      .set({
        currentWeight: progression.newWeight,
        updatedAt: new Date(),
      })
      .where(eq(exercises.id, exerciseId))
  }

  return progression
}

/**
 * Get progression suggestions for all exercises (for preview)
 */
export async function getProgressionSuggestions(): Promise<
  Array<{
    exercise: Exercise
    progression: ProgressionResult
  }>
> {
  const allExercises = await db.query.exercises.findMany({
    with: {
      sessionLogs: {
        orderBy: desc(sessionLog.loggedAt),
        limit: 5,
      },
    },
  })

  const suggestions = await Promise.all(
    allExercises.map(async (exercise) => ({
      exercise,
      progression: await calculateWeightProgression(exercise.id),
    })),
  )

  // Only return exercises that have suggestions for updates
  return suggestions.filter((s) => s.progression.shouldUpdate)
}
