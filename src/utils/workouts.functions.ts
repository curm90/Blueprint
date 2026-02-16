import { and, desc, eq, gte, lt } from 'drizzle-orm'
import type { WorkoutCreate } from '@/db/schema'
import { db } from '@/db'
import {
  sessionLog,
  workoutExercises,
  workoutLogs,
  workouts,
} from '@/db/schema'

export async function addWorkout(workout: WorkoutCreate) {
  try {
    // Create workout with selectedDays as comma-separated string
    const [workoutResult] = await db
      .insert(workouts)
      .values({
        name: workout.name,
        selectedDays: workout.selectedDays.join(','),
      })
      .returning()

    // Add exercises to workout - now with exercise data embedded
    if (workout.exercises.length > 0) {
      const workoutExerciseData = workout.exercises.map((exercise) => ({
        workoutId: workoutResult.id,
        name: exercise.name,
        currentWeight: exercise.currentWeight,
        startingWeight: exercise.startingWeight,
        minReps: exercise.minReps,
        maxReps: exercise.maxReps,
        weightIncrement: exercise.weightIncrement || 2.5,
        unit: exercise.unit,
        order: exercise.order,
      }))

      await db.insert(workoutExercises).values(workoutExerciseData)
    }

    console.log('Workout added successfully:', { workoutResult })
    return workoutResult
  } catch (error) {
    console.error('Error adding workout to database:', error)
    throw new Error(`Failed to add workout to database: ${error}`)
  }
}

export async function getWorkouts() {
  try {
    const res = await db.query.workouts.findMany({
      with: {
        workoutExercises: {
          orderBy: (exercise: any) => exercise.order,
        },
      },
      orderBy: desc(workouts.createdAt),
    })
    console.log('Workouts retrieved successfully:', { res })
    return res
  } catch (error) {
    console.error({ error })
    throw new Error(`Failed to retrieve workouts: ${error}`)
  }
}

export async function getWorkoutById(workoutId: number) {
  try {
    const res = await db.query.workouts.findFirst({
      where: eq(workouts.id, workoutId),
      with: {
        workoutExercises: {
          orderBy: (exercise: any) => exercise.order,
        },
        workoutLogs: {
          orderBy: desc(workoutLogs.completedAt),
          with: {
            sessionLogs: {
              with: {
                workoutExercise: true,
              },
            },
          },
        },
      },
    })
    console.log('Workout retrieved successfully:', { res })
    return res
  } catch (error) {
    console.error({ error })
    throw new Error(`Failed to retrieve workout: ${error}`)
  }
}

export async function getTodaysWorkouts() {
  try {
    // Get current day of week (e.g., 'Mon', 'Tue', etc.)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' })

    const allWorkouts = await db.query.workouts.findMany({
      with: {
        workoutExercises: {
          orderBy: (exercise: any) => exercise.order,
        },
        workoutLogs: {
          orderBy: desc(workoutLogs.completedAt),
        },
      },
    })

    // Filter workouts that include today
    const todaysWorkouts = allWorkouts.filter((workout) =>
      workout.selectedDays.split(',').includes(today),
    )

    console.log("Today's workouts retrieved successfully:", { todaysWorkouts })
    return todaysWorkouts
  } catch (error) {
    console.error({ error })
    throw new Error(`Failed to retrieve today's workouts: ${error}`)
  }
}

export async function deleteWorkout(workoutId: number) {
  try {
    // Get all workout exercises for this workout
    const workoutExercisesList = await db.query.workoutExercises.findMany({
      where: eq(workoutExercises.workoutId, workoutId),
    })

    // Delete session logs for all exercises in this workout
    for (const workoutExercise of workoutExercisesList) {
      await db
        .delete(sessionLog)
        .where(eq(sessionLog.workoutExerciseId, workoutExercise.id))
    }
    console.log(`Deleted session logs for workout ${workoutId}`)

    // Delete workout logs
    await db.delete(workoutLogs).where(eq(workoutLogs.workoutId, workoutId))
    console.log(`Deleted workout logs for workout ${workoutId}`)

    // Delete workout exercises (cascade should handle this, but being explicit)
    await db
      .delete(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId))
    console.log(`Deleted workout exercises for workout ${workoutId}`)

    // Delete the workout itself
    const res = await db.delete(workouts).where(eq(workouts.id, workoutId))
    console.log('Workout deleted successfully:', { res })

    return res
  } catch (error) {
    console.error('Error deleting workout:', error)
    throw new Error(`Failed to delete workout: ${error}`)
  }
}

export async function updateWorkout(
  workoutId: number,
  updates: Partial<WorkoutCreate>,
) {
  try {
    // Update workout basic info
    const workoutUpdates: any = {}
    if (updates.name) workoutUpdates.name = updates.name
    if (updates.selectedDays)
      workoutUpdates.selectedDays = updates.selectedDays.join(',')

    if (Object.keys(workoutUpdates).length > 0) {
      await db
        .update(workouts)
        .set(workoutUpdates)
        .where(eq(workouts.id, workoutId))
    }

    // Update exercises if provided - now with exercise data embedded
    if (updates.exercises) {
      // Delete existing workout exercises
      await db
        .delete(workoutExercises)
        .where(eq(workoutExercises.workoutId, workoutId))

      // Add new workout exercises
      if (updates.exercises.length > 0) {
        const workoutExerciseData = updates.exercises.map((exercise) => ({
          workoutId,
          name: exercise.name,
          currentWeight: exercise.currentWeight,
          startingWeight: exercise.startingWeight,
          minReps: exercise.minReps,
          maxReps: exercise.maxReps,
          weightIncrement: exercise.weightIncrement || 2.5,
          unit: exercise.unit,
          order: exercise.order,
        }))

        await db.insert(workoutExercises).values(workoutExerciseData)
      }
    }

    console.log('Workout updated successfully')
    return await getWorkoutById(workoutId)
  } catch (error) {
    console.error({ error })
    throw new Error(`Failed to update workout: ${error}`)
  }
}

export async function logWorkoutComplete(workoutId: number, notes?: string) {
  try {
    const res = await db.insert(workoutLogs).values({
      workoutId,
      notes,
    })
    console.log('Workout completion logged successfully:', { res })
    return res
  } catch (error) {
    console.error('Error logging workout completion:', error)
    throw new Error(`Failed to log workout completion: ${error}`)
  }
}

// Start a workout session (creates workoutLog entry)
export async function startWorkoutSession(workoutId: number, notes?: string) {
  try {
    const [workoutLogResult] = await db
      .insert(workoutLogs)
      .values({
        workoutId,
        notes: notes || `Started workout session`,
      })
      .returning()

    console.log('Workout session started successfully:', { workoutLogResult })
    return workoutLogResult
  } catch (error) {
    console.error('Error starting workout session:', error)
    throw new Error(`Failed to start workout session: ${error}`)
  }
}

// Update existing workout session as completed
export async function completeWorkoutSession(
  workoutLogId: number,
  notes?: string,
) {
  try {
    const [updatedLog] = await db
      .update(workoutLogs)
      .set({
        notes: notes || 'Workout completed',
        completedAt: new Date(),
      })
      .where(eq(workoutLogs.id, workoutLogId))
      .returning()

    console.log('Workout session completed successfully:', { updatedLog })
    return updatedLog
  } catch (error) {
    console.error('Error completing workout session:', error)
    throw new Error(`Failed to complete workout session: ${error}`)
  }
}

// New function to get unique exercise templates for reuse
export async function getExerciseTemplates() {
  try {
    const exercises = await db.query.workoutExercises.findMany({
      orderBy: desc(workoutExercises.createdAt),
    })

    // Create a map to get unique exercises by name (keeping the most recent)
    const uniqueExercises = new Map()

    exercises.forEach((exercise) => {
      const key = `${exercise.name}-${exercise.unit}`
      if (!uniqueExercises.has(key)) {
        uniqueExercises.set(key, {
          name: exercise.name,
          currentWeight: exercise.currentWeight,
          startingWeight: exercise.startingWeight,
          minReps: exercise.minReps,
          maxReps: exercise.maxReps,
          weightIncrement: exercise.weightIncrement,
          unit: exercise.unit,
        })
      }
    })

    const templates = Array.from(uniqueExercises.values())
    console.log('Exercise templates retrieved successfully:', { templates })
    return templates
  } catch (error) {
    console.error('Error getting exercise templates:', error)
    throw new Error(`Failed to get exercise templates: ${error}`)
  }
}

// Check if a workout was completed today
export async function isWorkoutCompletedToday(
  workoutId: number,
): Promise<boolean> {
  try {
    const today = new Date()
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    )
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    )

    const completionToday = await db
      .select()
      .from(workoutLogs)
      .where(
        and(
          eq(workoutLogs.workoutId, workoutId),
          gte(workoutLogs.completedAt, startOfDay),
          lt(workoutLogs.completedAt, endOfDay),
        ),
      )
      .limit(1)

    return completionToday.length > 0
  } catch (error) {
    console.error('Error checking if workout was completed today:', error)
    return false
  }
}

// Get workout exercises with progress data (session logs)
export async function getWorkoutExercisesWithProgress() {
  try {
    const exercises = await db.query.workoutExercises.findMany({
      with: {
        sessionLogs: {
          orderBy: desc(sessionLog.loggedAt),
        },
      },
      orderBy: desc(workoutExercises.createdAt),
    })

    // Group exercises by name to show combined progress
    const exerciseMap = new Map()

    exercises.forEach((exercise) => {
      const key = exercise.name.toLowerCase()
      if (!exerciseMap.has(key)) {
        exerciseMap.set(key, {
          ...exercise,
          sessionLogs: exercise.sessionLogs,
        })
      } else {
        // Merge session logs for exercises with the same name
        const existing = exerciseMap.get(key)
        existing.sessionLogs = [
          ...existing.sessionLogs,
          ...exercise.sessionLogs,
        ]
        // Update to latest exercise data if this one is newer
        if (
          exercise.createdAt &&
          existing.createdAt &&
          exercise.createdAt > existing.createdAt
        ) {
          exerciseMap.set(key, {
            ...exercise,
            sessionLogs: existing.sessionLogs,
          })
        }
      }
    })

    const result = Array.from(exerciseMap.values())
    console.log('Workout exercises with progress retrieved successfully:', {
      count: result.length,
    })
    return result
  } catch (error) {
    console.error('Error getting workout exercises with progress:', error)
    throw new Error(`Failed to get workout exercises with progress: ${error}`)
  }
}
