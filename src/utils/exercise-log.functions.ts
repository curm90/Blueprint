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
    return res
  } catch (error) {
    console.error({ error })
    throw new Error(`Failed to add session log: ${error}`)
  }
}
