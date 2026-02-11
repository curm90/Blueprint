import type { ExerciseCreate } from '@/db/schema'
import { db } from '@/db'
import { exercises } from '@/db/schema'

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
