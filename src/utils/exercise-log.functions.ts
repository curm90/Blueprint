import { eq } from 'drizzle-orm'
import type { SessionLogInsert } from '@/db/schema'
import { sessionLog } from '@/db/schema'
import { db } from '@/db'

export async function addSessionLog(
  exerciseId: number,
  data: SessionLogInsert,
) {
  try {
    const res = await db.insert(sessionLog).values({
      exerciseId,
      difficulty: data.difficulty,
      notes: data.notes,
    })

    console.log('Session log added successfully:', { res })
    return res
  } catch (error) {
    console.log({ error })
  }
}

export async function getSessionLogsForExercise(exerciseId: number) {
  try {
    const res = await db
      .select()
      .from(sessionLog)
      .where(eq(sessionLog.exerciseId, exerciseId))
    console.log('Session logs retrieved successfully:', { res })
    return res
  } catch (error) {
    console.log({ error })
  }
}
