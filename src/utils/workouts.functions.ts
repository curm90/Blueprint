import { desc, eq } from 'drizzle-orm'
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

    // Add exercises to workout
    if (workout.exerciseIds.length > 0) {
      const workoutExerciseData = workout.exerciseIds.map(
        (exerciseId, index) => ({
          workoutId: workoutResult.id,
          exerciseId,
          order: index + 1,
        }),
      )

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
          with: {
            exercise: true,
          },
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
          with: {
            exercise: true,
          },
        },
        workoutLogs: {
          orderBy: desc(workoutLogs.completedAt),
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
          with: {
            exercise: true,
          },
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
    // Delete session logs for this workout
    await db.delete(sessionLog).where(eq(sessionLog.workoutId, workoutId))
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

    // Update exercises if provided
    if (updates.exerciseIds) {
      // Delete existing workout exercises
      await db
        .delete(workoutExercises)
        .where(eq(workoutExercises.workoutId, workoutId))

      // Add new workout exercises
      if (updates.exerciseIds.length > 0) {
        const workoutExerciseData = updates.exerciseIds.map(
          (exerciseId, index) => ({
            workoutId,
            exerciseId,
            order: index + 1,
          }),
        )

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
