import type { SessionLogInsert } from '@/db/schema'
import { sessionLog } from '@/db/schema'
import { db } from '@/db'

export async function addSessionLog(data: SessionLogInsert) {
  try {
    console.log('🟢 addSessionLog called with data:', {
      workoutExerciseId: data.workoutExerciseId,
      workoutLogId: data.workoutLogId,
      weight: data.weight,
      reps: data.reps,
      difficulty: data.difficulty,
      notes: data.notes,
    })

    const res = await db.insert(sessionLog).values({
      workoutExerciseId: data.workoutExerciseId,
      workoutLogId: data.workoutLogId,
      weight: data.weight,
      reps: data.reps,
      difficulty: data.difficulty,
      notes: data.notes,
    })

    console.log('🟢 Session log inserted successfully:', res)
    return res
  } catch (error) {
    console.error('🔴 Error in addSessionLog:', { error })
    throw new Error(`Failed to add session log: ${error}`)
  }
}
