import { desc, eq } from 'drizzle-orm'
import type { ExerciseCreate } from '@/db/schema'
import { db } from '@/db'
import { exercises, sessionLog } from '@/db/schema'

export async function addExercise(exercise: ExerciseCreate) {
  try {
    const res = await db.insert(exercises).values(exercise)

    console.log('Exercise added successfully:', { res })

    return res
  } catch (error) {
    console.error('Error adding exercise to database:', error)
    throw new Error('Failed to add exercise to database')
  }
}

export async function getExercises() {
  try {
    const res = await db.select().from(exercises)
    console.log('Exercises retrieved successfully:', { res })
    return res
  } catch (error) {
    console.log({ error })
  }
}

export async function getExercisesWithProgress() {
  try {
    const res = await db.query.exercises.findMany({
      with: {
        sessionLogs: {
          orderBy: desc(sessionLog.loggedAt),
        },
      },
    })
    console.log('Exercises with progress retrieved successfully:', { res })
    return res
  } catch (error) {
    console.log({ error })
    throw error
  }
}

export async function deleteExercise(exerciseId: number) {
  try {
    // First delete all session logs for this exercise
    await db.delete(sessionLog).where(eq(sessionLog.exerciseId, exerciseId))
    console.log(`Deleted session logs for exercise ${exerciseId}`)

    // Then delete the exercise itself
    const res = await db.delete(exercises).where(eq(exercises.id, exerciseId))
    console.log('Exercise deleted successfully:', { res })

    return res
  } catch (error) {
    console.error('Error deleting exercise:', error)
    throw new Error(`Failed to delete exercise: ${error}`)
  }
}

export async function updateExercise(
  exerciseId: number,
  updates: Partial<ExerciseCreate>,
) {
  try {
    const res = await db
      .update(exercises)
      .set(updates)
      .where(eq(exercises.id, exerciseId))
    console.log('Exercise updated successfully:', { res })
    return res
  } catch (error) {
    console.log({ error })
    throw error
  }
}
