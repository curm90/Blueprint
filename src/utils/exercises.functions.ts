import { db } from '@/db'
import { exercises } from '@/db/schema'

export async function addExercise(exercise: {
  name: string
  currentWeight: number
  startingWeight: number
  unit: string
  minReps: number
  maxReps: number
}) {
  try {
    const res = await db.insert(exercises).values(exercise)

    console.log('Exercise added successfully:', { res })

    return res
  } catch (error) {
    console.error('Error adding exercise to database:', error)
    throw new Error('Failed to add exercise to database')
  }
}
